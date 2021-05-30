const express = require('express')
const router = express.Router()
const itemsController = require('../controllers/item-controllers')

// endpoints

// gets
// params = search for searching specific item/s, params = '/' for searching all items
router.get('/', itemsController.getItemsData)

// get sort
// params = expensive for getting items from most expensive to cheapest, params = '/' for getting items from cheapest to most expensive
router.get('/price', itemsController.getPriceDetail)

// posts
router.post('/post', itemsController.postItemData)
// category
router.post('/item-category/:id', itemsController.postItemsToItemCategory)
router.post('/category', itemsController.postCategoryItems)
// variant
router.post('/item-variant/:id', itemsController.postItemsToItemVariant)
router.post('/variant', itemsController.postItemsToVariantItem)

// updates
router.put('/edit/:id', itemsController.updateItem)
router.patch('/:id', itemsController.updateItemPartial)

// delete
router.delete('/:id', itemsController.deleteItemById)

module.exports = router
