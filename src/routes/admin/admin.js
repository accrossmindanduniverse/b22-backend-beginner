const express = require('express')
const router = express.Router()
const itemCategoriesController = require('../../controllers/itemCategories-controllers')
const itemsController = require('../../controllers/item-controllers')
const itemVariantControllers = require('../../controllers/itemVariant-controllers')
// const upload = require('../../middlewares/upload')

const multer = require('multer')
// const { response } = require('../helpers/index')
const path = require('path')

const maxSize = 1024 * 1024 * 2

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(process.cwd(), 'assets', 'pictures'))
  },
  filename: function (_req, file, cb) {
    const ext = file.originalname.split('.')[1]
    const date = new Date()
    cb(null, `${date.getTime()}.${ext}`)
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize }
})

const authMiddleware = require('../../middlewares/authMiddleware')

router.post('/items', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, upload.single('picture'), itemsController.postItemData)
router.post('/post-variant', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, itemVariantControllers.postItemsToVariantItem)
router.post('/post-category', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, itemCategoriesController.postCategoryItems)
router.post('/variant', itemVariantControllers.postItemsToItemVariant)

router.post('/item-category/:id', authMiddleware.verifyAdmin, itemCategoriesController.postItemsToItemCategoryRaw)

router.put('/update-items/:id', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, upload.single('picture'), itemsController.updateItem)

router.patch('/patch-items/:id', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, itemsController.updateItemPartial)
router.delete('/:id', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, itemsController.deleteItemById)

module.exports = router
