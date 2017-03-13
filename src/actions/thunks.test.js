process.env.TEST_ROOM_NAME = 'TESTING_' + new Date().toUTCString();
process.env.RTC_SUPPORTED = true;

const { createStore, combineReducers, applyMiddleware } = require('redux');
const { connected, rtc, create, enter } = require('../index');
const { deleteRoom, findRoom } = require('../connect/rooms');

const ROOM_NAME = process.env.TEST_ROOM_NAME;

const buildStore = () => 
    createStore(
        combineReducers({ rtc }), 
        applyMiddleware(connected)
    );

it('Should successfully create room', () => {

    const store = buildStore();

    return create()(store.dispatch)
    .then(() => {
        const state = store.getState();
        expect(state.rtc.token).toBe(ROOM_NAME);
    });

})

it('Should successfully enter room', () => {

    const store = buildStore();

    return enter(ROOM_NAME)(store.dispatch)
    .then(() => {
        const state = store.getState();
        expect(state.rtc.token).toBe(ROOM_NAME);
    });
})

it('Should error if room not found', () => {
    const store = buildStore();

    return enter('INVALID')(store.dispatch)
    .then(() => {
        const state = store.getState();
        expect(state.rtc.error).toBe('No Room Found');
    });
})

it('Should error if RTC not available', () => {

    const store = buildStore();
    process.env.RTC_SUPPORTED = false;
    return create()(store.dispatch)
    .then(() => {
        const state = store.getState();
        expect(state.rtc.error).toBe("RTC not available");
    });
})

it('Should clean up room on disconnect', () => {
    return new Promise((res, rej) => {
        deleteRoom(ROOM_NAME)
        setTimeout(() => {
            findRoom(ROOM_NAME)
            .then(() => rej)
            .catch(err => res(true))
        }, 1000)
    }).then(res => expect(res).toBeTruthy())
})