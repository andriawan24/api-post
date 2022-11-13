const categoryService = require('../services/category_service')

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
      data: {
        categories,
        metadata
      }
    })
  }
}
