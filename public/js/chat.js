const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $locationButton = document.querySelector('#send-location')

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
        console.log(`The message was ${message}`)
    })
})

$locationButton.addEventListener('click', () => {

    if(!navigator.geolocation) {
        return alert('Geolocation not available on your browser')
    }

    //Disable
    $locationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('sendLocation',{
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
        }, (message) => {
            $locationButton.removeAttribute('disabled')
            console.log(`response: ${message}`)
        })
    })
})

socket.on('message', (message, callback) => {
    console.log(message)
})