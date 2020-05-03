const express = require('express')
const path = require('path')

const app = express()
app.use(express.json())

const port = process.env.PORT || 3000

const author = 'Michael Hawkins'

// Define paths for express config
const public = path.join(__dirname,'../public')

// Setup static directory to server
app.use(express.static(public))

module.exports = app