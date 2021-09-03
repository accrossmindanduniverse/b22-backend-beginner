const { response } = require('../helpers')
const Chat = require('../models/chat')
const time = require('../helpers/time')
const FCMToken = require('../models/fcmToken')
const firebase = require('../helpers/firebase')
// eslint-disable-next-line no-unused-vars
const env = process.env

module.exports = {

  createChat: async (req, res) => {
    const user = req.authUser.result[0]
    const setData = req.body
    setData.sender_id = user.id
    setData.isLatest = 1
    const newIsLatest = 0
    // eslint-disable-next-line camelcase
    const { sender_id, recipient_id } = setData
    try {
      const findUser = await FCMToken.findToken(setData.recipient_id)
      // if (req.file) {
      //   setData.file = `${env.APP_FILE_ROUTE}/${req.file.filename}`
      // } else {
      //   setData.file = null
      // }
      if (parseInt(setData.recipient_id) === user.id) return response(res, false, 'Internal Server Error', 400)
      await Chat.updateIsLatest(newIsLatest, sender_id, parseInt(recipient_id))
      const result = await Chat.createChat(setData)
      result.data = {
        id: result.insertId,
        file: setData.file,
        message: setData.message,
        sender_id: setData.sender_id.toString(),
        recipient_id: setData.recipient_id,
        // eslint-disable-next-line no-unneeded-ternary
        isLatest: setData.isLatest === 1 ? true : false
      }
      req.socket.emit(setData.recipient_id, {
        sender: user.id,
        // for some reason I add the user variable into this object too
        senderData: user,
        recipient: setData.recipient_id,
        message: setData.message
      })
      if (findUser[0]?.token !== undefined) {
        firebase.messaging.sendToDevice(findUser[0].token, {
          notification: {
            title: 'History Coffee',
            body: `${user.name}: ${setData.message}`
          }
        })
      }
      return response(res, true, result.data, 200)
    } catch (err) {
      // istanbul ignore next
      console.log(err)
      // istanbul ignore next
      return response(res, false, 'An error occured', 500)
    }
  },

  deleteChatRoom: async (req, res) => {
    const signed = req.authUser.result[0]
    const setData = req.body
    const { id } = req.params
    setData.deleted_at = time.now()

    try {
      const result = await Chat.getChatForDelete(signed.id, id)
      const other = await Chat.getDeleteChatRoomForNonNull(signed.id, id)
      if (result.length > 0) {
        await Chat.newDeleteChatRoom({
          deleted_at: setData.deleted_at,
          deleted_by: signed.id
        }, signed.id, id)
      }
      if (other.length > 0) {
        // istanbul ignore next
        await Chat.newDeleteChatRoomForNonNull({
          deleted_at: setData.deleted_at,
          deleted_by: 'both deleted'
        }, signed.id, id)
      }
      return response(res, true, [result, other], 200)
    } catch (err) {
      // istanbul ignore next
      console.log(err)
      // istanbul ignore next
      return response(res, false, 'An error occured', 500)
    }
  },

  getAllChat: async (req, res) => {
    const user = req.authUser.result[0]
    const newData = []
    const newArr = []
    try {
      const result = await Chat.getAllChat(user.id)
      result.map((e, idx) => {
        if (result[idx].id === user.id) {
          delete result[idx]
        } else {
          newData.push(result[idx])
        }
        return e
      })
      newData.map((e, idx) => {
        if (newData[idx].deleted_by === user.id.toString() || newData[idx].deleted_by === 'both deleted') {
          delete newData[idx]
        } else {
          // istanbul ignore next
          newArr.push(newData[idx])
        }
        return e
      })
      return response(res, true, newArr, 200)
    } catch (err) {
      // istanbul ignore next
      console.log(err)
      // istanbul ignore next
      return response(res, false, 'An error occured', 500)
    }
  },

  getChat: async (req, res) => {
    const { id } = req.authUser.result[0]
    const recipient = req.params.recipient_id
    const newResult = []
    try {
      const result = await Chat.getChatBySingedUser(id, recipient)
      result.map((e, idx) => {
        // istanbul ignore next
        if (result[idx].deleted_by === id.toString() || result[idx].deleted_by === 'both deleted') {
          delete result[idx]
        } else {
          // istanbul ignore next
          newResult.push(result[idx])
        }
        // istanbul ignore next
        return e
      })
      if (newResult.includes > 1) delete [newResult]
      return response(res, true, newResult, 200)
    } catch (err) {
      // istanbul ignore next
      console.log(err)
      // istanbul ignore next
      return response(res, false, 'An error occured', 500)
    }
  }

}
