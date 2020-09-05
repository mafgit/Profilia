const User = require('../models/User')
const Post = require('../models/Post')
const ObjectId = require('mongodb').ObjectID
module.exports = {
	get_profile: (req, res) => {
		User.findOne({ email: req.userId }, (err, user) => {
			res.json({ user })
		})
	},
	get_posts: (req, res) => {
		Post.find({ author: req.userEmail }, (err, posts) => {
			res.json({ posts })
		})
	},
	get_followers: (req, res) => {
		const arr = []
		User.findOne({ email: req.userEmail }).then((user) => {
			user.followers.forEach((follower, i) => {
				User.findById(follower, (err, user) => {
					const { fullName, country, image, _id } = user
					arr.push({ fullName, country, image, _id })
					if (i === arr.length - 1) {
						return res.json({ followers: arr })
					}
				})
			})
		})
	},
	get_following: (req, res) => {
		const arr = []
		User.findOne({ email: req.userEmail }).then((user) => {
			user.following.forEach((followingOne, i) => {
				User.findById(followingOne, (err, user) => {
					const { fullName, country, image, _id } = user
					arr.push({ fullName, country, image, _id })
					if (i === arr.length - 1) {
						return res.json({ following: arr })
					}
				})
			})
		})
	},
	create_post: (req, res) => {
		const { body } = req.body
		Post.create({ body, author: req.userEmail, likes: [], comments: [] }).then(
			(post) => {
				res.json({ created_post: post })
			}
		)
	},
	post_post_likes: (req, res) => {
		const { postId, type } = req.body
		let updates = {}
		if (type === 'like') {
			updates = {
				$addToSet: { likes: req.userEmail },
			}
		} else if (type === 'unlike') {
			updates = {
				$pull: { likes: req.userEmail },
			}
		}
		Post.findByIdAndUpdate(postId, updates, { new: true }).exec((err, post) => {
			if (err) throw err
			return res.json({ post })
		})
	},
	unfollow: (req, res) => {
		const unfollowId = req.body.id
		User.findByIdAndUpdate(
			req.userId,
			{
				$pull: { following: ObjectId(unfollowId) },
			},
			{ new: true }
		).exec((err, user) => {
			if (err) throw err
			res.json({ following: user.following })
		})
	},
	search_users: (req, res) => {
		let regexp = new RegExp(req.body.search, 'gi')
		console.log(req.body.search)
		User.find({ fullName: { $regex: regexp } })
			.then((users) => res.json({ users }))
			.catch((err) => console.log(err))
	},
}
