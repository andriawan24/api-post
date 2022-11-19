const { Op } = require('sequelize')
const { Post } = require('../database/models')
const NotFoundError = require('../exceptions/NotFoundError')
const ConflictError = require('../exceptions/ConflictError')

const getAll = async (query = null) => {
  const options = {}

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

  const { count, rows: posts } = await Post.findAndCountAll(options)

  const data = {
    posts,
    metadata: {
      total_data: count,
      total_page: Math.ceil(count / parseInt(limit)),
      data_per_page: parseInt(limit),
      current_page: parseInt(page)
    }
  }

  return data
}

const get = async (id) => {
  const post = await Post.findOne({
    where: { id },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })

  if (!post) {
    throw new NotFoundError('Post tidak ditemukan')
  }

  return post
}

const create = async (payload) => {
  try {
    const posts = await Post.create({
      ...payload,
      userId: payload.user_id
    })

    return posts
  } catch (err) {
    throw new ConflictError(err)
  }
}

const update = async (id, payload) => {
  try {
    const post = await get(id)
    const newPost = post.update({
      ...payload
    })
    return newPost
  } catch (err) {
    throw new ConflictError(err)
  }
}

const destroy = async (id) => {
  try {
    const post = await get(id)
    const deletedPost = post.destroy()
    return deletedPost
  } catch (err) {
    if (err instanceof NotFoundError) {
      throw new NotFoundError(err.message)
    } else {
      throw new ConflictError(err.message)
    }
  }
}

module.exports = {
  getAll,
  get,
  create,
  update,
  destroy
}
