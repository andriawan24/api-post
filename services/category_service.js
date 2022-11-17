const { Op } = require('sequelize')
const { Category } = require('../database/models')
const NotFoundError = require('../exceptions/NotFoundError')
const ConflictError = require('../exceptions/ConflictError')

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

const getCategory = async (id) => {
  const category = await Category.findOne({
    where: { id },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })

  if (!category) {
    throw new NotFoundError('Kategori tidak ditemukan')
  }

  return category
}

const createCategory = async (name, slug) => {
  try {
    const category = await Category.create({
      name,
      slug
    })

    return category
  } catch (err) {
    throw new ConflictError('Nama kategori sudah digunakan')
  }
}

const updateCategory = async (id, name, slug) => {
  try {
    const category = await getCategory(id)
    const newCategory = category.update({ name, slug })
    return newCategory
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw new NotFoundError(err.message)
    } else {
      throw new ConflictError('Nama kategori sudah digunakan')
    }
  }
}

const deleteCategory = async (id) => {
  try {
    const category = await getCategory(id)
    const deletedCategory = category.destroy()
    return deletedCategory
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw new NotFoundError(err.message)
    } else {
      throw new ConflictError(err.message)
    }
  }
}

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
}
