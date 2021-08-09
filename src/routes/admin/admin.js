const express = require('express')
const router = express.Router()
const itemCategoriesController = require('../../controllers/itemCategories-controllers')
const itemsController = require('../../controllers/item-controllers')
const itemVariantControllers = require('../../controllers/itemVariant-controllers')
const upload = require('../../middlewares/upload')

const authMiddleware = require('../../middlewares/authMiddleware')

router.post('/items', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, upload, itemsController.postItemData)
router.post('/post-variant', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, itemVariantControllers.postItemsToVariantItem)
router.post('/post-category', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, itemCategoriesController.postCategoryItems)
router.post('/variant', itemVariantControllers.postItemsToItemVariant)

router.post('/item-category/:id', authMiddleware.verifyAdmin, itemCategoriesController.postItemsToItemCategoryRaw)

router.put('/update-items/:id', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, upload, itemsController.updateItem)

router.patch('/patch-items/:id', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, itemsController.updateItemPartial)
router.delete('/:id', authMiddleware.verifyJwt, authMiddleware.verifyAdmin, itemsController.deleteItemById)

module.exports = router
