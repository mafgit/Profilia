const User = require('../models/User')
const Post = require('../models/Post')
const ObjectId = require('mongoose').Types.ObjectId
module.exports = {
	get_profile: (req, res) => {
		User.findById(ObjectId(req.body.id), (err, user) => {
			res.json({ user })
		})
	},
	get_posts: (req, res) => {
		Post.find({ author: req.userId }, (err, posts) => {
			res.json({ posts })
		})
	},
	get_follow: (req, res) => {
		const { id, follow } = req.params
		User.findById(ObjectId(id), (err, user) => {
			User.find({ _id: { $in: user[follow] } }).then((result) => {
				res.json({
					result: result.map((f) => ({
						fullName: f.fullName,
						image: f.image,
						country: f.country,
						_id: f._id,
					})),
				})
			})
		})
	},
	create_post: (req, res) => {
		const { body } = req.body
		User.findById(req.userId, (err, user) => {
			Post.create({
				body,
				author: req.userId,
				authorName: user.fullName,
				likes: [],
				comments: [],
			}).then((post) => {
				res.json({ created_post: post })
			})
		})
	},
	change_post_like: (req, res) => {
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
	search_users: (req, res) => {
		let regexp = new RegExp(req.body.search, 'gi')
		console.log(req.body.search)
		User.find({ fullName: { $regex: regexp } })
			.then((users) => res.json({ users }))
			.catch((err) => console.log(err))
	},
	changeFollow: (req, res) => {
		const id = ObjectId(req.params.id)
		const { type } = req.params
		if (id != req.userId) {
			const update1 =
				type === 'follow'
					? {
							$addToSet: { following: id },
					  }
					: { $pull: { following: id } }
			const update2 =
				type === 'follow'
					? {
							$addToSet: { followers: req.userId },
					  }
					: {
							$pull: { followers: req.userId },
					  }

			Promise.all([
				User.findByIdAndUpdate(req.userId, update1, { new: true }),
				User.findByIdAndUpdate(id, update2, { new: true }),
			]).then((result) => {
				res.json({ followers: result[1].followers })
			})
		}
	},
	get_home: (req, res) => {
		User.findById(req.userId).then((user) => {
			Post.find({ author: { $in: user.following } }).then((posts) => {
				return res.json({ posts })
			})
		})
	},
}

// notify
// follow, unfollow, post created, deleted, updated, profile updated
