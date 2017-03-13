require('whatwg-fetch');

const connected = require('./middleware/middleware');
const rtc = require('./reducer/reducer');
const { create, enter } = require('./actions/thunks');

module.exports = {
    connected,
    rtc,
    create,
    enter
}