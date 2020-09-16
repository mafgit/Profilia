const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization || 'wrong token'
  token = token.split(' ')[1]
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!decoded) return res.json({ error: 'Unauthorized' })
    req.userEmail = decoded.email
    req.userId = ObjectId(decoded._id)
    next()
  })
}
module.exports = verifyToken
