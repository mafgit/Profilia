const router = require('express').Router()
const verifyToken = require('../middlewares/verifyToken')
const { signup_post, login_post } = require('../controllers/authController')
const { get_profile, get_posts } = require('../controllers/dataController')

router.post('/signup', signup_post)
router.post('/login', login_post)

router.get('/profile', verifyToken, get_profile)
router.get('/get_posts', verifyToken, get_posts)

module.exports = router
