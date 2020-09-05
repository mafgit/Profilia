const jwt = require('jsonwebtoken')
const verifyToken = (req, res, next) => {
	let token = req.headers['authorization']
	if (token && typeof token !== undefined) {
		token = token.split(' ')[1]
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) return res.status(401).json({ error: 'Unauthorized' })
			req.userEmail = decoded.email
			req.userId = decoded._id
			next()
		})
	} else {
		return res.status(401).json({ error: 'Unauthorized' })
	}
}

module.exports = verifyToken
