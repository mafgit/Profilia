const jwt = require('jsonwebtoken')
const verifyToken = (req, res, next) => {
	const token = req.headers['authorization'].split(' ')[1]
	if (token && typeof token !== undefined) {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) return res.status(401).json({ error: 'Unauthorized' })
			req.userEmail = decoded.email
			next()
		})
	} else {
		return res.status(401).json({ error: 'Unauthorized' })
	}
}

module.exports = verifyToken
