const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, index: true, maxlength: 20 },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  bio: { type: String, required: true, maxlength: 120 },
  country: { type: String, required: true, index: true },
  following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
})

module.exports = mongoose.model('User', userSchema)
