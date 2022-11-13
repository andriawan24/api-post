const express = require('express')
const categoryController = require('../controllers/categories')
const router = express.Router()
const { Category } = require('../database/models')

router.get('/', categoryController.getCategories)

router.post('/', async (req, res) => {
  const category = await Category.create({
    name: 'Naufal',
    slug: 'naufal'
  })

  res.status(200).json({
    message: 'L',
    data: category
  })
})

module.exports = router
