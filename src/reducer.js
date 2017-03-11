const { combineReducers } = require('redux');
const { pluck } = require('rp-utils');
const actions = require('./actions');

const pluckErr = payload => 
    pluck(payload, 'error.message') || pluck(payload, 'error') || null

const connectionState = payload => ({
    token: pluck(payload, 'token') || null,
    streams: pluck(payload, 'streams') || [],
    loading: pluck(payload, 'loading') || false,
    error: pluckErr(payload)
});

const connection = (state=connectionState(), action) => {
    const types = actions.connection;
    switch (action.type) {
        case types.LOADING: return connectionState({
            loading: true
        });
        case types.CREATE: return connectionState({
            token: action.payload,
            streams: state.streams
        });
        case types.REACTION: return connectionState({
            token: state.token,
            streams: [...state.streams, action.payload]
        });
        case types.ERROR: return connectionState({
            error: action.payload
        });
        default: return state;
    }
}

module.exports = combineReducers({
    connection
})