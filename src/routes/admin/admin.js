const express = require('express')
const router = express.Router()
const itemCategoriesController = require('../../controllers/itemCategories-controllers')
const itemsController = require('../../controllers/item-controllers')
const itemVariantControllers = require('../../controllers/itemVariant-controllers')

const authMiddleware = require('../../middlewares/authMiddleware')

const storage = require('../../helpers/upload')
const multer = require('multer')

const upload = multer({
  storage: storage
})

router.post('/post', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, upload.single('picture'), itemsController.postItemData)
router.post('/post-variant', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, itemVariantControllers.postItemsToVariantItem)
router.post('/post-category', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, itemCategoriesController.postCategoryItems)
router.post('/variant', itemVariantControllers.postItemsToItemVariant)

router.put('/update-items/:id', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, itemsController.updateItem)

router.patch('/patch-items/:id', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, itemsController.updateItemPartial)
router.delete('/:id', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, itemsController.deleteItemById)

module.exports = router
