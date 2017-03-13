let init = require('./init');
const { flow } = require('rp-utils');

const permissions = {
    audio: true,
    video: true,
    data: true
}

if (process.env.TEST) {
    class MockRTC {
        constructor () {
            this.channel = process.env.TEST_ROOM_NAME;
            this.sdpConstraints = {}
            this.caniuse = {}
            this.caniuse.RTCPeerConnection = process.env.RTC_SUPPORTED === 'true' ? true : false;
            this.sessionDescription = {
                sessionid: this.channel,
                userid: this.channel
            }
        }
        token () {
            return this.channel;
        }
        open (opts) {
            const { onMediaCaptured } = opts;
            onMediaCaptured();
        }
        join () {

        }
    }
    const _init = init;
    init = _init.then(() => MockRTC)
}

const Connect = (sessionDescription, options) => init.then(RTC => new Promise((res, rej) => {
    const connection = new RTC();
    if (!connection.caniuse.RTCPeerConnection) return rej({ message: 'RTC not available' });

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
}));

module.exports = Connect;