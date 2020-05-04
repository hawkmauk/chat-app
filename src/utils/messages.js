const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime(0)
    }
}
const generateLocationMessage = (url) => {
    return {
        url,
        createdAt: new Date().getTime(0)
    }
}
module.exports = {
    generateMessage,
    generateLocationMessage
}