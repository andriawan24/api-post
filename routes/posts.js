const express = require('express')
const postsController = require('../controllers/posts')
const upload = require('../middlewares/upload')
const router = express.Router()
const postsValidator = require('../validators/posts')

router.get('/', postsController.getPosts)
router.get('/:id', postsController.getPost)
router.post('/', upload, postsValidator, postsController.createPost)
router.put('/:id', upload, postsValidator, postsController.updatePost)
router.delete('/:id', postsController.deletePost)

module.exports = router
