const User = require('../models/User')
const Post = require('../models/Post')
module.exports = {
	get_profile: (req, res) => {
		User.findOne({ email: req.userEmail }, (err, user) => {
			res.json({ user })
		})
	},
	get_posts: (req, res) => {
		Post.find({ author: req.userEmail }, (err, posts) => {
			res.json({ posts })
		})
	},
}
