const Joi = require('joi')
const InvariantError = require('../exceptions/InvariantError')

module.exports = async (req, res, next) => {
  const { body } = req
  const options = {
    name: Joi.string().required()
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
