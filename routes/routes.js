const router = require('express').Router()
const verifyToken = require('../middlewares/verifyToken')
const {
	signup_post,
	login_post,
	check_auth,
} = require('../controllers/authController')
const {
	get_profile,
	get_posts,
	get_followers,
	get_following,
	create_post,
	post_post_likes,
	unfollow,
	search_users,
} = require('../controllers/dataController')

router.post('/signup', signup_post)
router.post('/login', login_post)
router.post('/search_users', verifyToken, search_users)
router.get('/check_auth', verifyToken, check_auth)

router.get('/profile', verifyToken, get_profile)
router.get('/get_posts', verifyToken, get_posts)
router.get('/get_followers', verifyToken, get_followers)
router.get('/get_following', verifyToken, get_following)

router.post('/create_post', verifyToken, create_post)
router.post('/post_post_likes', verifyToken, post_post_likes)
router.post('/unfollow', verifyToken, unfollow)

module.exports = router
