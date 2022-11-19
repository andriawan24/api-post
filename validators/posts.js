const Joi = require('joi')
const InvariantError = require('../exceptions/InvariantError')

module.exports = async (req, res, next) => {
  const { body } = req
  let options = { }

  if (req.method === 'PUT') {
    options = {
      title: Joi.string(),
      body: Joi.string(),
      status: Joi.string().allow('published', 'unpublished', 'draft'),
      featured: Joi.boolean(),
      category_id: Joi.number(),
      tags: Joi.array().empty(),
      user_id: Joi.number()
    }
  } else {
    options = {
      title: Joi.string().required(),
      body: Joi.string().required(),
      status: Joi.string().allow('published', 'unpublished', 'draft'),
      featured: Joi.boolean(),
      category_id: Joi.number().required(),
      tags: Joi.array().empty(),
      user_id: Joi.number().required()
    }
  }

  try {
    const schema = Joi.object(options)
    const validateResult = schema.validate(body)
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message)
    }
    next()
  } catch (err) {
    next(err)
  }
}
