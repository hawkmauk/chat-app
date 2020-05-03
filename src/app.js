const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.json())

const port = process.env.PORT || 3000

const author = 'Michael Hawkins'

// Define paths for express config
const public = path.join(__dirname,'../public')

// Setup static directory to server
app.use(express.static(public))

io.on('connection', (socket) => {

    console.log('New websocket connection')

    socket.emit('message', 'Welocme to the chat app')
    socket.broadcast.emit('message','A new user has joined')

    socket.on('message', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }

        io.emit('message', message)
        callback()
    })

    socket.on('disconnect', () => {
        console.log('User has disconnected')
        io.emit('message', 'User has left the chat')
    })

    socket.on('sendLocation', (coords, callback) => {
        socket.broadcast.emit('message',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback('Location shared!')
    })
})

module.exports = server