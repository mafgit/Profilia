const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
	{
		body: { type: String, required: true },
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		postId: { type: mongoose.Schema.Types.ObjectId, required: true },
		likes: { type: Array, required: true },
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Comment', commentSchema)
