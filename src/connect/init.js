const { flow } = require('rp-utils');

const SCRIPT_URL = 'https://cdn.webrtc-experiment.com/RTCMultiConnection.js';

let RTC;

module.exports = new Promise((res, rej) => {
    if (window.RTCMultiConnection) RTC = window.RTCMultiConnection;

    if (RTC) return res(RTC);

    flow.Safely(() => {
        const script = document.createElement('script');
        document.body.appendChild(script);
        return script;
    })
    .map(script => {
        script.src = SCRIPT_URL;
        script.onerror = rej;
        script.onload = () => {
            RTC = window.RTCMultiConnection;
            if (RTC) return res(RTC);
            rej(null);
        }
    })
    .fold(err => rej(err), () => {
        //NO OP - RESOLVED ASYNC ABOVE
    });
});