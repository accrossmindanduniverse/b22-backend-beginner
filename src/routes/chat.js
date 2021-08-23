const express = require('express')
const router = express.Router()
const chat = require('../controllers/chat')
const auth = require('../middlewares/authMiddleware')
const file = require('../middlewares/fileUpload')

router.get('/room', auth.verifyJwt, chat.getAllChat)
router.post('/send', auth.verifyJwt, file, chat.createChat)
router.put('/delete-chat-room/:id', auth.verifyJwt, chat.deleteChatRoom)
router.get('/:recipient_id', auth.verifyJwt, chat.getChat)

module.exports = router
