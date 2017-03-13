const { connection } = require('./actions');
const { createRoom, enterRoom } = require('../connect/rooms');

/**
 * Create RTC Connection
 * 
 * @example
 * 
 * import { create } from 'redux-rtc';
 * 
 * dispatch(create());
 * 
 */

const create = (payload) => {
    return (dispatch) => {
        const onstream = e => dispatch(connection.reaction(e));

        dispatch(connection.loading());

        createRoom(payload, onstream)
        .then(room => {
            room.onmessage = (e) => dispatch(e.data);
            dispatch(connection.create({
                token: room.channel,
                room: room
            }));
        })
        .catch(err => {
            dispatch(connection.error(err));
        });
    }
}

/**
 * Join Open RTC Connection
 * 
 * @example
 * 
 * import { enter } from 'redux-rtc';
 * 
 * dispatch(enter({@link Connection#token}));
 * 
 */

const enter = (payload) => {
    return (dispatch) => {
        const onstream = e => dispatch(connection.reaction(e));

        dispatch(connection.loading());

        enterRoom(payload, onstream)
        .then(room => {
            room.onmessage = (e) => dispatch(e.data);
            dispatch(connection.create({
                token: room.channel,
                room: room
            }));
        })
        .catch(err => {
            dispatch(connection.error(err));
        });
    }
}

module.exports = {
    create,
    enter
}