const express = require('express')
const router = express.Router()

const itemsRoute = require('./items')
const categoryRoutes = require('./categories')
const variantRoutes = require('./variants')
const authRoutes = require('./auth')
const roleRoutes = require('./role')
const userRoutes = require('./user/user')
const transactionRoutes = require('./transactions')
const adminRoutes = require('./admin/admin')
const chatRoutes = require('./chat')
const downloadRoutes = require('./download')

// prefix('/')
router.use('/items', itemsRoute)
router.use('/category', categoryRoutes)
router.use('/variant', variantRoutes)
router.use('/auth', authRoutes)
router.use('/role', roleRoutes)
router.use('/user', userRoutes)
router.use('/private', transactionRoutes)
router.use('/chat', chatRoutes)
router.use('/download', downloadRoutes)

router.use('/admin', adminRoutes)

module.exports = router
