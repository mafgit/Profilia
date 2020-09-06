const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
	body: { type: String, required: true },
	author: { type: mongoose.Types.ObjectId, required: true },
	authorName: { type: String, required: true },
	likes: { type: Array, required: true },
	comments: { type: Array, required: true },
})

// {
//     id: 'ObjectID(1234)',
//     comment: 'Comment Body',
//     commentLikes: ['ObjectID(1234)', 'ObjectID(1234)', 'ObjectID(1234)'],
// }

module.exports = mongoose.model('Post', postSchema)
