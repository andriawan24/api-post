module.exports = (err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    status: err.status || 'failed',
    message: err.message || 'internal server error',
    data: null
  })
}
