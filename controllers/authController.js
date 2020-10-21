const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

module.exports = {
	signup_post: (req, res) => {
		const { fullName, email, password, password2, country } = req.body
		if (email) {
			User.findOne({ email }).then((findEmail) => {
				if (findEmail) {
					return res.json({ error: 'Email is already registered' })
				}
				if (!email.match(emailRegex)) {
					return res.json({ error: 'Enter a valid email' })
				}
				if (password.length < 6) {
					return res.json({
						error: 'Minimum length of password is 6 characters',
					})
				}
				if (!fullName || !email || !password2 || !password || !country) {
					return res.json({ error: 'Please fill in all the fields' })
				}
				if (password !== password2) {
					return res.json({ error: 'Passwords do not match' })
				}
				bcrypt.genSalt(10, (err, salt) => {
					if (err) throw err
					bcrypt.hash(password, salt, (err, hashedPassword) => {
						if (err) console.log(err)
						const newUser = new User({
							fullName,
							email,
							password: hashedPassword,
							country,
							bio: 'No information given.',
							image:
								'https://cdn.pixabay.com/photo/2016/08/31/11/54/user-1633249_960_720.png',
							following: [ObjectId('5f5dddff854430254c63e4e5')],
							followers: [ObjectId('5f5dddff854430254c63e4e5')],
						})
						newUser
							.save()
							.then((user) => {
								User.findOneAndUpdate(
									{ email: 'maf@maf.com' },
									{ $addToSet: { followers: user._id } },
									{ new: true }
								).then((maf) => {
									User.findByIdAndUpdate(maf._id, {
										$addToSet: { following: user._id, followers: user._id },
									}).then(() => {
										jwt.sign(
											{ _id: user._id, email: user.email },
											process.env.JWT_SECRET,
											(error, token) => {
												if (error) return res.json({ error })
												res.cookie('jwt', token, {
													maxAge: 7 * 24 * 60 * 60 * 1000,
													httpOnly: true,
													secure:
														process.env.NODE_ENV === 'production'
															? true
															: false,
												})
												return res.status(200).json({
													user: {
														email: user.email,
														_id: user._id,
														image: user.image,
													},
												})
											}
										)
									})
								})
							})
							.catch((err) => console.log(err))
					})
				})
			})
		}
	},
	login_post: (req, res) => {
		const { email, password } = req.body
		if (email && password) {
			User.findOne({ email }).then((user) => {
				if (user) {
					bcrypt.compare(password, user.password).then((isMatch) => {
						if (isMatch) {
							jwt.sign(
								{ _id: user._id, email },
								process.env.JWT_SECRET,
								(err, token) => {
									res.cookie('jwt', token, {
										maxAge: 7 * 24 * 60 * 60 * 1000,
										httpOnly: true,
										secure:
											process.env.NODE_ENV === 'production' ? true : false,
									})
									return res.status(200).json({
										user: {
											email: user.email,
											_id: user._id,
											image: user.image,
										},
									})
								}
							)
						} else {
							return res.json({ error: 'Invalid credentials' })
						}
					})
				} else {
					return res.json({ error: 'Invalid credentials' })
				}
			})
		} else {
			return res.json({ error: 'Please fill all the fields' })
		}
	},
	check_auth: (req, res) => {
		User.findById(req.userId)
			.select('email _id image')
			.exec((error, user) => {
				if (error || !user) {
					return res.status(401).json({ error })
				}
				return res.status(200).json({
					user,
				})
			})
	},
	update_pw: (req, res) => {
		const { oldPassword, password, password2 } = req.body
		if (password2 !== password) {
			return res.json({ error: 'Passwords must match' })
		}
		if (
			oldPassword.length < 6 ||
			password2.length < 6 ||
			password2.length < 6
		) {
			return res.json({ error: 'Password must be at least 6 characters long' })
		}
		if (!oldPassword || !password2 || !password2) {
			return res.json({ error: 'You must fill all three fields' })
		}
		User.findById(req.userId, (err, user) => {
			bcrypt.compare(oldPassword, user.password).then((isMatch) => {
				if (isMatch) {
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(password, salt, (err, hashed) => {
							User.findByIdAndUpdate(req.userId, {
								$set: { password: hashed },
							}).then(() => {
								return res.json({ success: 'Password Updated' })
							})
						})
					})
				} else {
					return res.json({ error: 'Invalid Password' })
				}
			})
		})
	},
}
