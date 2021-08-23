const { db } = require('../helpers/db')
const { promisify } = require('util')

const execPromise = promisify(db.query).bind(db)

module.exports = {

  createChat: function (data) {
    return execPromise('INSERT INTO chat (message, file, sender_id, recipient_id, isLatest) VALUE (?, ?, ?, ?, ?)', [data.message, data.file, data.sender_id, data.recipient_id, data.isLatest])
  },

  updateIsLatest: function (data, newData1, newData2) {
    return execPromise('UPDATE chat SET isLatest=? WHERE sender_id IN (?, ?) AND recipient_id IN (?, ?)', [data, newData1, newData2, newData1, newData2])
  },

  getChatRoom: function (data1, data2) {
    return execPromise('SELECT * FROM chat WHERE sender_id IN (?, ?) AND recipient_id IN (?, ?)', [data1, data2, data1, data2])
  },

  getAllChat: function (data1) {
    return execPromise('SELECT * FROM chat LEFT JOIN users ON users.id = chat.sender_id OR users.id = chat.recipient_id WHERE (sender_id = ? OR recipient_id = ?) AND isLatest = ?', [data1, data1, '1'])
  },

  getChatBySingedUser: function (data1, data2) {
    return execPromise('SELECT * FROM chat WHERE sender_id IN (?, ?) AND recipient_id IN (?, ?)', [data1, data2, data1, data2])
  },

  newDeleteChatRoom: function (data, user, other) {
    return execPromise('UPDATE chat SET ? WHERE sender_id IN (?, ?) AND recipient_id IN (?, ?) AND deleted_by IS NULL', [data, user, other, user, other])
  },

  newDeleteChatRoomForNonNull: function (data, user, other) {
    return execPromise('UPDATE chat SET ? WHERE sender_id IN (?, ?) AND recipient_id IN (?, ?) AND deleted_by = ?', [data, user, other, user, other, other])
  },

  getChatForDelete: function (user, other) {
    return execPromise('SELECT * FROM chat WHERE sender_id IN (?, ?) AND (recipient_id IN (?, ?) OR deleted_by IS NULL)', [user, other, user, other])
  },

  getDeleteChatRoomForNonNull: function (user, other) {
    return execPromise('SELECT * FROM chat WHERE sender_id IN (?, ?) AND recipient_id IN (?, ?) AND deleted_by = ?', [user, other, user, other, other])
  }

}
