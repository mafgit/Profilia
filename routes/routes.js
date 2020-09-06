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
	get_follow,
	create_post,
	get_home,
	change_post_like,
	changeFollow,
	search_users,
} = require('../controllers/dataController')

router.post('/signup', signup_post)
router.post('/login', login_post)
router.post('/search_users', verifyToken, search_users)
router.get('/check_auth', verifyToken, check_auth)

router.get('/get_home', verifyToken, get_home)
router.post('/profile', verifyToken, get_profile)
router.post('/get_posts', verifyToken, get_posts)
router.get('/get_follow/:follow/:id', verifyToken, get_follow)

router.post('/create_post', verifyToken, create_post)
router.post('/change_post_like', verifyToken, change_post_like)
router.get('/:type/:id', verifyToken, changeFollow)

module.exports = router
