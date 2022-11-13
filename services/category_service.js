const { Op } = require('sequelize')
const { Category } = require('../database/models')

const getAllCategories = async (query = null) => {
  const options = {
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  }

  const { page = 1, limit = 10, search } = query
  const skip = (parseInt(page) - 1) * parseInt(limit)

  if (search) {
    options.where = {
      name: {
        [Op.like]: `%${search}%`
      }
    }
  }

  if (page && limit) {
    options.offset = skip
    options.limit = parseInt(limit)
    options.subQuery = false
  }

  const { count, rows: categories } = await Category.findAndCountAll(options)

  const data = {
    categories,
    metadata: {
      total_data: count,
      total_page: Math.ceil(count / parseInt(limit)),
      data_per_page: parseInt(limit),
      current_page: parseInt(page)
    }
  }

  return data
}

module.exports = {
  getAllCategories
}
