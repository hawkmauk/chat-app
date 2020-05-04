const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //disable
    $messageFormButton.setAttribute('disabled', 'disabled')

    message = e.target.elements.message.value
    socket.emit('message', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error){
            return console.log(ack)
        }
    })
})

$locationButton.addEventListener('click', () => {

    if(!navigator.geolocation) {
        return alert('Geolocation not available on your browser')
    }

    //Disable
    $locationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        
        socket.emit('sendLocation',{
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
        }, (message) => {
            $locationButton.removeAttribute('disabled')
        })
    })
})

socket.on('message', (message, callback) => {

    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message, callback) => {

    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.emit('join', { username, room }, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})