const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
	{
		body: { type: String, required: true },
		author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
		likes: { type: Array, required: true },
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Post', postSchema)
