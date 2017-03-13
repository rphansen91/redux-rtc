const { pluck } = require('rp-utils');

let queued = [];

const connected = ({ dispatch, getState }) => next => action => {

    if (typeof action === 'function') return action(dispatch, getState);

    if (action && action.connected) {
        action.connected = false; // Dont want endless dispatches
        queued = [...queued, action];

        const state = getState();
        if (!state.rtc) {
            console.warn("The Redux RTC reducer must be added to state as 'rtc'");
        }

        const room = pluck(state, 'rtc.room');
        if (room && room.numberOfConnectedUsers > 0) {
            queued.map(room.send);
            queued = [];
        } else {
            console.warn("No room found, saving action");
        }
    }

    return next(action);
}

module.exports = connected;