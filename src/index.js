require('whatwg-fetch');

const reducer = require('./reducer');
const actions = require('./actions');
const { create, enter, dispatchAll } = require('./thunks');

module.exports = {
    reducer,
    actions,
    create,
    enter,
    dispatchAll
}