const { connection } = require('./actions');
const { createRoom, enterRoom } = require('../connect/rooms');

const create = (payload) => {
    return (dispatch) => {
        const onstream = e => dispatch(connection.reaction(e));

        dispatch(connection.loading());

        return createRoom(payload, onstream)
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

const enter = (payload) => {
    return (dispatch) => {
        const onstream = e => dispatch(connection.reaction(e));

        dispatch(connection.loading());

        return enterRoom(payload, onstream)
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