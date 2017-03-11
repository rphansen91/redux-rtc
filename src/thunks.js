const { connection, message } = require('./actions');
const { createRoom, enterRoom } = require('./connect/rooms');

let connected;
let queued = [];

const create = (payload) => {
    return (dispatch) => {
        const onstream = e => dispatch(connection.reaction(e));

        dispatch(connection.loading());

        createRoom(payload, onstream)
        .then(conn => {
            // Use conn.send to dispatch to peers
            connected = conn;
            conn.onmessage = (e) => dispatch(e.data);
            dispatch(connection.create(conn.channel));
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

        enterRoom(payload, onstream)
        .then(conn => {
            connected = conn;
            conn.onmessage = (e) => dispatch(e.data);
            dispatch(connection.create(conn.channel));
        })
        .catch(err => {
            dispatch(connection.error(err));
        });
    }
}

const dispatchAll = (action) => {
    return (dispatch) => {
        dispatch(action);

        queued = [...queued, action];

        if (!connected || connected.numberOfConnectedUsers <= 0) return;
        
        console.log("DISPATCHING TO PEERS", queued);
        queued.map(a => connected.send(a));
        queued = [];
    }
}

module.exports = {
    create,
    enter,
    dispatchAll
}