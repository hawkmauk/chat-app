const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')

const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

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

    socket.on('join', ({ username, room }, callback) => {

        const { error, user } = addUser({ id: socket.id, username, room })

        if(error){
            return callback(error)
        }
        
        socket.join(user.room)

        socket.emit('message', generateMessage('Welcome to the chat app'))
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined`))

        callback()
    })

    socket.on('message', (message, callback) => {

        const user = getUser(socket.id)
        console.log(user)

        const filter = new Filter()

        if (filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(message))
        callback()
    })

    socket.on('disconnect', () => {
        console.log('User has disconnected')

        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage(`${user.username} has left`))
        }
    })

    socket.on('sendLocation', (coords, callback) => {
        const message = generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        socket.broadcast.emit('locationMessage',message)
        callback('Location shared!')
    })

})

module.exports = server