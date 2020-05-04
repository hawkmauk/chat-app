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

        socket.emit('message', generateMessage('admin', 'Welcome to the chat app'))
        socket.broadcast.to(user.room).emit('message',generateMessage('admin',`${user.username} has joined`))
        io.to(user.room).emit('roomdata', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('message', (message, callback) => {

        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)){
            return callback('Profanity is not allowed')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('disconnect', () => {
        console.log('User has disconnected')

        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage('admin',`${user.username} has left`))
            io.to(user.room).emit('roomdata', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

    socket.on('sendLocation', (coords, callback) => {

        const user = getUser(socket.id)

        const message = generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        socket.broadcast.to(user.room).emit('locationMessage', message)
        callback('Location shared!')
    })

})

module.exports = server