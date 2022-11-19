const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const categoriesRouter = require('./routes/categories')
const postsRouter = require('./routes/posts')
const errorhandler = require('./middlewares/errorhandler')

require('dotenv').config()
const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/categories', categoriesRouter)
app.use('/posts', postsRouter)

// Error Handling
app.use(function (req, res, next) {
  res.status(404)
  // respond with json
  return res.status(404).json({
    status: 'failed',
    message: 'not found',
    data: null
  })
})
app.use(errorhandler)

module.exports = app
