'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const logger = require('morgan')
const config = require('./config/index')
const app = express()

const {postObject, getObject} = require('./routes')

app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.post('/object', postObject)
app.get('/object/:key', getObject)

app.listen(config.port, () => {
  console.log(`Server running on port: ${config.port}`)
})

module.exports = app
