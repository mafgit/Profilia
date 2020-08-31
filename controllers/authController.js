const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const Post = require('../models/Post')

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

module.exports = {
	signup_post: (req, res) => {
		const { firstName, lastName, email, password, country } = req.body
		let errors = []
		if (email) {
			User.findOne({ email }).then((findEmail) => {
				if (findEmail) {
					errors.push('Email is already registered')
				}
				if (!email.match(emailRegex)) {
					errors.push('Enter a valid email')
				}
				if (password.length < 6) {
					errors.push('Minimum length of password is 6 characters')
				}
				if (!firstName || !lastName || !email || !password || !country) {
					errors.push('Please fill in all the fields')
				}
				if (errors.length > 0) {
					return res.status(400).json({ errors })
				} else {
					bcrypt.genSalt(10, (err, salt) => {
						if (err) throw err
						bcrypt.hash(password, salt, (err, hashedPassword) => {
							if (err) console.log(err)
							User.create({
								firstName,
								lastName,
								email,
								password: hashedPassword,
								country,
								bio: 'No information given.',
								image:
									'https://cdn.pixabay.com/photo/2016/08/31/11/54/user-1633249_960_720.png',
								following: [],
								followers: [],
							})
								.then((user) => res.json({ newUser: user._id }))
								.catch((err) => console.log(err))
						})
					})
				}
			})
		}
	},
	login_post: (req, res) => {
		const { email, password } = req.body
		if (email && password) {
			User.findOne({ email }, (err, user) => {
				if (user) {
					bcrypt.compare(password, user.password, (err, isMatch) => {
						if (isMatch) {
							jwt.sign({ email }, process.env.JWT_SECRET, (err, token) => {
								res.json({ token, user })
							})
						} else {
							return res.status(400).json({ errors: ['Invalid credentials'] })
						}
					})
				} else {
					return res.status(400).json({ errors: ['Invalid credentials'] })
				}
			})
		} else {
			return res.status(400).json({ errors: ['Please fill all the fields'] })
		}
	},
}

// updating followers
// User.updateOne(
//   { _id: '5f4abb6b2d303d2c24458add' },
//   { $addToSet: { followers: 'ObjectID' } }
// ).then((user) => {
//   res.json({ user })
// })
