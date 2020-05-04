const generateMessage = ( username, text ) => {
    return {
        username,
        text,
        createdAt: new Date().getTime(0)
    }
}
const generateLocationMessage = ( username, url ) => {
    return {
        username,
        url,
        createdAt: new Date().getTime(0)
    }
}
module.exports = {
    generateMessage,
    generateLocationMessage
}