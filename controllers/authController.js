const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const Post = require('../models/Post')
const ObjectId = require('mongoose').Types.ObjectId

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

module.exports = {
  signup_post: (req, res) => {
    const { fullName, email, password, password2, country } = req.body
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
        if (!fullName || !email || !password2 || !password || !country) {
          errors.push('Please fill in all the fields')
        }
        if (password !== password2) {
          errors.push('Passwords do not match')
        }
        if (errors.length > 0) {
          return res.status(400).json({ errors })
        } else {
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
                following: [ObjectId('5f570c0dba7ee017b4884b41')],
                followers: [],
              })
              newUser
                .save()
                .then((user) => {
                  User.findOneAndUpdate(
                    { email: 'maf@maf.com' },
                    { $addToSet: { followers: user._id } }
                  ).then((maf) => {
                    jwt.sign(
                      { _id: user._id, email: user.email },
                      process.env.JWT_SECRET,
                      (err, token) => {
                        return res.json({
                          token,
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
      User.findOne({ email }).then((user) => {
        if (user) {
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (isMatch) {
              jwt.sign(
                { _id: user._id, email },
                process.env.JWT_SECRET,
                (err, token) => {
                  return res.json({
                    token,
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
    User.findById(req.userId, (err, user) => {
      res.json({
        user: { email: user.email, _id: user._id, image: user.image },
      })
    })
  },
  update_pw: (req, res) => {
    const errors = []
    const { oldPassword, password, password2 } = req.body
    if (password2 !== password) {
      errors.push('Passwords must match')
    }
    if (
      oldPassword.length < 6 ||
      password2.length < 6 ||
      password2.length < 6
    ) {
      errors.push('Password must be at least 6 characters long')
    }
    if (!oldPassword || !password2 || !password2) {
      errors.push('You must fill all three fields')
    }
    if (errors[0]) {
      return res.json({ errors })
    } else {
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
            return res.json({ errors: ['Invalid Password'] })
          }
        })
      })
    }
  },
}
