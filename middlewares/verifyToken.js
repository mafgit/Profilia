const jwt = require('jsonwebtoken')
const ObjectId = require('mongoose').Types.ObjectId

const verifyToken = (req, res, next) => {
	if (req.cookies.jwt) {
		jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => {
			if (decoded) {
				req.userEmail = decoded.email
				req.userId = ObjectId(decoded._id)
				return next()
			} else {
				res.clearCookie('jwt')
				return res.status(401).json({ error: 'Unauthorized' })
			}
		})
	} else {
		return res.status(401).json({ error: 'Unauthorized' })
	}
}
module.exports = verifyToken
