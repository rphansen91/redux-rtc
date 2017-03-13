const { connection } = require('../actions/actions');
const rtc = require('./reducer');

const MOCK_ROOM = {
    token: 'ROOM_ID',
    room: 'ROOM'
}

const MOCK_STREAM = 'STREAM'

test('Initial state should be defined', () => {
    const state = rtc(undefined, {});
    expect(state.token).toBeNull();
    expect(state.room).toBeNull();
    expect(state.streams.length).toBe(0);
});

test('Should have a loading state', () => {
    const state = rtc(undefined, connection.loading());
    expect(state.loading).toBeTruthy();
});

test('Should have an error state', () => {
    const state = rtc(undefined, connection.error({message: 'Error'}));
    expect(state.error).toBe('Error');
});

test('Should be able to create a room', () => {
    const state = rtc(undefined, connection.create(MOCK_ROOM));
    expect(state.token).toBe('ROOM_ID');
    expect(state.room).toBe('ROOM');
});

test('Should receive streams', () => {
    const state = rtc(undefined, connection.reaction(MOCK_STREAM));
    expect(JSON.stringify(state.streams)).toBe('["STREAM"]');
})

test('Room should be maintained', () => {
    let state = rtc(undefined, connection.create(MOCK_ROOM));
    state = rtc(state, connection.reaction(MOCK_STREAM));
    expect(state.token).toBe('ROOM_ID');
    expect(state.room).toBe('ROOM');
    expect(JSON.stringify(state.streams)).toBe('["STREAM"]');
})