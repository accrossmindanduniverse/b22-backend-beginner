const { response } = require('../helpers')
const Chat = require('../models/chat')
const time = require('../helpers/time')
const FCMToken = require('../models/fcmToken')
const firebase = require('../helpers/firebase')
const env = process.env

module.exports = {

  createChat: async (req, res) => {
    const user = req.authUser.result[0]
    const setData = req.body
    setData.sender_id = user.id
    setData.isLatest = 1
    const newIsLatest = 0
    console.log(req.file, 'file')
    // eslint-disable-next-line camelcase
    const { sender_id, recipient_id } = setData
    try {
      const findUser = await FCMToken.findToken(setData.recipient_id)
      if (req.file) {
        setData.file = `${env.APP_FILE_ROUTE}/${req.file.filename}`
      } else {
        setData.file = null
      }
      if (parseInt(setData.recipient_id) === user.id) return response(res, false, 'Internal Server Error', 400)
      await Chat.updateIsLatest(newIsLatest, sender_id, parseInt(recipient_id), (err, data) => {
        if (!err) return response(res, true, data, 200)
      })
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
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  },

  // deleteChatRoom: async (req, res) => {
  //   const { id } = req.authUser.result[0]
  //   const setData = req.body
  //   setData.deleted_at = time.now()
  //   setData.deleted_by = setData.deleted_by || id
  //   const newData = {
  //     deleted_at: setData.deleted_at,
  //     deleted_by: 'both deleted'
  //   }
  //   const newData2 = {
  //     deleted_at: setData.deleted_at,
  //     deleted_by: id
  //   }
  //   try {
  //     const getResult = await Chat.getChatRoom(setData.recipient_id, id.toString())
  //     getResult.map((e) => {
  //       if (getResult[getResult.length - 1].deleted_by !== id.toString() && getResult[getResult.length - 1].deleted_by !== null) {
  //         newData.deleted_by = 'both deleted'
  //       } else {
  //         newData.deleted_by = id
  //       }
  //       return e
  //     })
  //     await Chat.deletePatch(newData2, id, parseInt(setData.recipient_id), (err, patchRes) => {
  //       if (!err) return response(res, true, patchRes, 200)
  //     })
  //     const result = await Chat.deleteChatRoom(newData, id, parseInt(setData.recipient_id), id)
  //     if (getResult[getResult.length - 1].deleted_by !== id.toString() && getResult[getResult.length - 1].deleted_by !== null) newData2.deleted_by = 'both deleted'
  //     return response(res, true, result, 200)
  //     // console.log(getResult[getResult.length - 2].deleted_by, 'deleted')
  //   } catch (err) {
  //     console.log(err)
  //     return response(res, false, 'An error occured', 500)
  //   }
  // },

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
        }, signed.id, id, (err, deleteResult) => {
          if (!err) return response(res, true, deleteResult, 200)
        })
      }
      if (other.length > 0) {
        await Chat.newDeleteChatRoomForNonNull({
          deleted_at: setData.deleted_at,
          deleted_by: 'both deleted'
        }, signed.id, id, (err, deleteResult2) => {
          if (!err) return response(res, true, deleteResult2, 200)
        })
      }
      console.log(result.length, 'first result')
      console.log(other.length, 'second result')
      return response(res, true, [result, other], 200)
    } catch (err) {
      console.log(err)
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
      console.log(newData, 'data new data')
      newData.map((e, idx) => {
        if (newData[idx].deleted_by === user.id.toString() || newData[idx].deleted_by === 'both deleted') {
          delete newData[idx]
        } else {
          newArr.push(newData[idx])
        }
        return e
      })
      return response(res, true, newArr, 200)
    } catch (err) {
      console.log(err)
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
        if (result[idx].deleted_by === id.toString() || result[idx].deleted_by === 'both deleted') {
          delete result[idx]
        } else {
          newResult.push(result[idx])
        }
        return e
      })
      if (newResult.includes > 1) delete [newResult]
      return response(res, true, newResult, 200)
    } catch (err) {
      console.log(err)
      return response(res, false, 'An error occured', 500)
    }
  }

}
