const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}

const app = express()
app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

mongoose
	.connect(process.env.MONGODB_URI, {
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
	})
	.then(() => {
		console.log(' - Connected to MongoDB')
	})
	.catch((err) => {
		console.log(err)
	})

app.use(require('./routes/routes'))

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'))
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(` - Server Running [${PORT}]`)
})
