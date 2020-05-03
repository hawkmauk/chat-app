const request = require('request')

// put these into objects so that they can be easily replaced
const mapbox = {
    url: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    api_token: 'pk.eyJ1IjoiaGF3a21hdWsiLCJhIjoiY2s1aWlhcDRoMGQzbTNqdDd3cmYwdTMxeSJ9.6qMUwxXb3qPHZlNHvIz92w',
    limit: 1,
    getUrl(search){
        return this.url + '/' + encodeURIComponent(search) + '.json?access_token=' + this.api_token + '&limit=' + this.limit
    }
}

// set the default provider
let provider = mapbox

const geocode = (search, callback) => {
    const url = provider.getUrl(search)
    request({ url, rejectUnauthorized: false, json: true}, (error, { body }) => {
        if (error) {
            callback('Unable to connect to location service', undefined)
        } else if (!body.features[0]) {
            callback('Unable to find location, try another search', undefined)
        } else (
            callback(undefined, {
                location: body.features[0].place_name,
                longitude: body.features[0].center[0],
                latitude: body.features[0].center[1]
            })
        )
    })
}

module.exports = geocode