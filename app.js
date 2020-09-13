const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(require('./routes/routes'))

mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log(' - Server Running\n - Connected to MongoDB')
    )
  })

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
}
