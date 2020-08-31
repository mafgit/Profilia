const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(require('./routes/routes'))

mongoose
	.connect(process.env.MONGO_URI, {
		useUnifiedTopology: true,
		useCreateIndex: true,
		useNewUrlParser: true,
	})
	.then(() => {
		app.listen(5000, () =>
			console.log(' - Server Running\n - Connected to MongoDB')
		)
	})
