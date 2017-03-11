const connect = require('./connect');
const { onunload } = require('../utils/browser');

const ROOM_URL = id => `https://redux-rtc.firebaseio.com/rooms/${id}.json`;

const createRoom = (_, onstream) => 
    connect(null, {
        onstream
    })
    .then(connection => {
        const { sessionDescription } = connection;

        onunload(() => deleteRoom(connection.channel));

        return saveRoom(connection.channel, sessionDescription)
        .then(() => connection);
    });

const enterRoom = (id, onstream) =>
    findRoom(id)
    .then((description) => {
        if (!description || !description.userid) return Promise.reject('No Room Found');
        return description;
    })
    .then(description => connect(description, {
        onstream
    }));

const saveRoom = (id, description) => {
    description.channel = id;
    return fetch(ROOM_URL(id), {
        method: 'POST',
        body: JSON.stringify(description)
    })
    .then(res => res.json())
}

const findRoom = (id) =>
    fetch(ROOM_URL(id))
    .then(res => res.json())
    .then(res => {
        if (!res) return Promise.reject('No Room Found');
        return res[Object.keys(res)[0]];
    })

const deleteRoom = (id) => {
    // Use XMLHttpRequest for unload reliability
    var client = new XMLHttpRequest();
    client.open("DELETE", ROOM_URL(id), false);
    client.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    client.send();
}

module.exports = {
    createRoom,
    enterRoom,
    deleteRoom
}