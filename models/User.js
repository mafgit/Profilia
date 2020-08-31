const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	image: { type: String, required: true },
	password: { type: String, required: true, minlength: 6 },
	bio: { type: String, required: true },
	country: { type: String, required: true },
	following: { type: Array, required: true },
	followers: { type: Array, required: true },
})

module.exports = mongoose.model('User', userSchema)
