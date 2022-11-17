const express = require('express')
const categoryController = require('../controllers/categories')
const router = express.Router()
const categoryValidator = require('../validators/category')

router.get('/', categoryController.getCategories)
router.get('/:id', categoryController.getCategory)
router.post('/', categoryValidator, categoryController.createCategory)
router.put('/:id', categoryValidator, categoryController.updateCategory)
router.delete('/:id', categoryController.deleteCategory)

module.exports = router
