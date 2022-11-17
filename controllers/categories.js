const NotFoundError = require('../exceptions/NotFoundError')
const categoryService = require('../services/category_service')
const { convertToSlug } = require('../utils/helper')

module.exports = {
  getCategories: async (req, res) => {
    const query = {}

    const { page, limit = 10 } = req.query
    query.limit = limit

    if (req.query.search) {
      query.search = req.query.search
    }

    if (page) {
      query.page = page
    }

    const { metadata, categories } = await categoryService.getAllCategories(query)

    // Handle Pagination Data
    const links = {}
    if (page > 1) {
      links.prev = `${req.protocol}://${req.get('host')}/categories?page=${parseInt(page) - 1}&limit=${limit}`
      metadata.links = links
    }

    if (page < metadata.total_page) {
      links.next = `${req.protocol}://${req.get('host')}/categories?page=${parseInt(page) + 1}&limit=${limit}`
      metadata.links = links
    }

    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mendapatkan kategori',
      data: {
        categories,
        metadata
      }
    })
  },
  getCategory: async (req, res, next) => {
    try {
      const { id } = req.params
      const category = await categoryService.getCategory(id)

      return res.status(200).json({
        status: 'success',
        message: 'Berhasil mendapatkan kategori',
        data: category
      })
    } catch (error) {
      next(error)
    }
  },
  createCategory: async (req, res, next) => {
    try {
      const { name } = req.body
      const slug = convertToSlug(name)

      const category = await categoryService.createCategory(name, slug)

      return res.status(200).json({
        status: 'success',
        message: 'Berhasil menambahkan kategori',
        data: category
      })
    } catch (error) {
      next(error)
    }
  },
  updateCategory: async (req, res, next) => {
    try {
      const { id } = req.params
      const { name } = req.body
      const slug = convertToSlug(name)

      if (!id) {
        throw NotFoundError('kategori tidak ditemukan')
      }

      const category = await categoryService.updateCategory(id, name, slug)

      return res.status(200).json({
        status: 'success',
        message: 'Berhasil mengubah kategori',
        data: category
      })
    } catch (err) {
      next(err)
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      const { id } = req.params

      if (!id) {
        throw NotFoundError('kategori tidak ditemukan')
      }

      await categoryService.deleteCategory(id)

      return res.status(200).json({
        status: 'success',
        message: 'Berhasil menghapus kategori',
        data: null
      })
    } catch (err) {
      next(err)
    }
  }
}
