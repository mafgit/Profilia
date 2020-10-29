const router = require('express').Router()
const verifyToken = require('../middlewares/verifyToken')
const {
	signup_post,
	login_post,
	check_auth,
	update_pw,
} = require('../controllers/authController')
const {
	get_profile,
	delete_comment,
	get_posts,
	get_follow,
	create_post,
	get_home,
	change_post_like,
	change_follow,
	search_users,
	update_details,
	delete_post,
	update_post,
	add_comment,
	load_comments,
} = require('../controllers/dataController')

// auth
router.post('/signup', signup_post)
router.post('/login', login_post)
router.get('/check_auth', verifyToken, check_auth)
router.get('/logout', (req, res) => {
	res.clearCookie('jwt')
	return res.send('Logged Out')
})

// get data
router.get('/get_home', verifyToken, get_home)
router.post('/get_profile', verifyToken, get_profile)
router.post('/get_posts', verifyToken, get_posts)
router.get('/search_users', verifyToken, search_users)

// follow / unfollow
router.get('/get_follow/:follow/:_id', verifyToken, get_follow)
router.get('/change_follow/:type/:_id', verifyToken, change_follow)

// related to posts
router.post('/create_post', verifyToken, create_post)
router.post('/change_post_like', verifyToken, change_post_like)
router.delete('/delete_post', verifyToken, delete_post)
router.patch('/update_post', verifyToken, update_post)

// update profile
router.patch('/update_pw', verifyToken, update_pw)
router.patch('/update_details', verifyToken, update_details)

// comments
router.post('/add_comment', verifyToken, add_comment)
router.post('/load_comments', verifyToken, load_comments)
router.delete('/delete_comment', verifyToken, delete_comment)

module.exports = router
