const { pluck } = require('rp-utils');
const actions = require('./actions');

const pluckErr = payload => 
    pluck(payload, 'error.message') || pluck(payload, 'error') || null

const connectionState = payload => ({
    token: pluck(payload, 'token') || null,
    room: pluck(payload, 'room') || null,
    streams: pluck(payload, 'streams') || [],
    loading: pluck(payload, 'loading') || false,
    error: pluckErr(payload)
});

/**
 * 
 * ReduxRTC State
 * 
 * // Required: The name of the reducer must be 'rtc'
 * 
 * @example
 *  import { reducer } from 'redux-rtc'
 *  combineReducers({
 *      rtc: reducer,
 *      ...
 *  })
 * 
 * @typedef Connection
 * @type {object}
 * @property {string} token - The unique id of the connection
 * @property {object} room - The room instance @link{http://www.rtcmulticonnection.org/docs/}
 * @property {Array} streams - All of the connected media elements
 * @property {boolean} loading - The loading status of the room
 * @property {string} error - Errors will propagate here
 * 
 */

const connection = (state=connectionState(), action) => {
    const types = actions.connection;
    switch (action.type) {
        case types.LOADING: return connectionState({
            loading: true
        });
        case types.CREATE: return connectionState({
            token: action.payload.token,
            room: action.payload.room,
            streams: state.streams
        });
        case types.REACTION: return connectionState({
            token: state.token,
            room: state.room,
            streams: [...state.streams, action.payload]
        });
        case types.ERROR: return connectionState({
            token: state.token,
            room: state.room,
            error: action.payload
        });
        default: return state;
    }
}

module.exports = connection;