const postsService = require('../services/posts')
const categoryService = require('../services/category')

module.exports = {
  getPosts: async (req, res) => {
    const query = {}

    const { page, limit = 10 } = req.query
    query.limit = limit

    if (req.query.search) {
      query.search = req.query.search
    }

    if (page) {
      query.page = page
    }

    const { metadata, posts } = await postsService.getAll(query)

    // Handle Pagination Data
    const links = {}
    if (page > 1) {
      links.prev = `${req.protocol}://${req.get('host')}/posts?page=${parseInt(page) - 1}&limit=${limit}`
      metadata.links = links
    }

    if (page < metadata.total_page) {
      links.next = `${req.protocol}://${req.get('host')}/posts?page=${parseInt(page) + 1}&limit=${limit}`
      metadata.links = links
    }

    return res.status(200).json({
      status: 'success',
      message: 'Berhasil mendapatkan post',
      data: {
        posts,
        metadata
      }
    })
  },
  getPost: async (req, res, next) => {
    try {
      const { id } = req.params
      const post = await postsService.get(id)
      const category = await categoryService.getCategory(post.categoryId)
      delete post.dataValues.categoryId

      return res.status(200).json({
        status: 'success',
        message: 'Berhasil mendapatkan post',
        data: {
          ...post.dataValues,
          category
        }
      })
    } catch (error) {
      next(error)
    }
  },
  createPost: async (req, res, next) => {
    try {
      const payload = req.body

      const category = await categoryService.getCategory(payload.category_id)

      const post = await postsService.create({
        ...payload,
        categoryId: category.id,
        thumbnail: req.protocol + '://' + req.get('host') + '/uploads/images/' + req.thumbnail_url
      })

      return res.status(200).json({
        status: 'success',
        message: 'Berhasil menambahkan post',
        data: post
      })
    } catch (error) {
      next(error)
    }
  },
  updatePost: async (req, res, next) => {
    try {
      const payload = req.body
      const { id } = req.params

      const post = await postsService.get(id)

      let categoryId = ''
      if (payload.category_id) {
        const category = await categoryService.getCategory(payload.category_id)
        categoryId = category.id
      } else {
        categoryId = post.categoryId
      }

      let thumbnailUrl = ''
      console.log('Thumbnail ' + req.thumbnail_url)
      if (req.thumbnail_url) {
        thumbnailUrl = req.protocol + '://' + req.get('host') + '/uploads/images/' + req.thumbnail_url
      } else {
        thumbnailUrl = post.thumbnail
      }

      const newPost = await postsService.update(id, {
        ...payload,
        categoryId,
        thumbnail: thumbnailUrl
      })

      return res.status(200).json({
        status: 'success',
        message: 'Berhasil mengubah post',
        data: newPost
      })
    } catch (error) {
      next(error)
    }
  },
  deletePost: async (req, res, next) => {
    try {
      const { id } = req.params

      await postsService.destroy(id)

      return res.status(200).json({
        status: 'success',
        message: 'Berhasil menghapus post',
        data: null
      })
    } catch (error) {
      next(error)
    }
  }
}
