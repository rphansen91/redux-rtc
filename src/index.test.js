const ReduxRTC = require('./index');

test('Expect middleware to be called "connected"', () => {
    expect(typeof ReduxRTC.connected).toBe('function');
})

test('Expect reducer to be called "rtc"', () => {
    expect(typeof ReduxRTC.rtc).toBe('function');
})

test('Expect create room action to be called "create"', () => {
    expect(typeof ReduxRTC.create).toBe('function');
})

test('Expect enter room action to be called "enter"', () => {
    expect(typeof ReduxRTC.enter).toBe('function');
})