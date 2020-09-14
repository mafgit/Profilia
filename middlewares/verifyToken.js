const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization']
  if (token && typeof token !== undefined) {
    token = token.split(' ')[1]
    jwt
      .verify(token, process.env.JWT_SECRET)
      .then((decoded) => {
        console.log(decoded)
        if (!decoded) return res.json({ error: 'Unauthorized' })
        req.userEmail = decoded.email
        req.userId = ObjectId(decoded._id)
        next()
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    return res.json({ error: 'Unauthorized' })
  }
}

module.exports = verifyToken
