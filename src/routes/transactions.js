const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const authMiddleware = require('../middlewares/authMiddleware')

// for all transactions are not available yet
router.post('/transaction', authMiddleware.verifyJwt, transactionController.createTransaction)
router.get('/user-transactions', authMiddleware.verifyJwt, transactionController.getAllTransactions)
router.delete('/:id', authMiddleware.verifyJwt, transactionController.deleteTransaction)
module.exports = router
