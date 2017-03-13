const init = require('./init');
const { flow } = require('rp-utils');

const permissions = {
    audio: true,
    video: true,
    data: true
}

const Connect = (sessionDescription, options) => init.then(RTC => new Promise((res, rej) => {
    const connection = new RTC();
    connection.enableFileSharing = true; 
    connection.session = permissions;

    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    };

    if (options.onstream) connection.onstream = options.onstream;

    if (!sessionDescription) {
        connection.channel = connection.token();
        connection.open({
            sessionid: connection.sessionid,
            onMediaCaptured: () => res(connection)
        })
    } else {
        connection.channel = sessionDescription.channel;
        connection.join(sessionDescription, permissions);
        res(connection);
    }
}))

module.exports = Connect;