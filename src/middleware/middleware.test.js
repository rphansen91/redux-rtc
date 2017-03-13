const middleware = require('./middleware');

it('Should call the next middleware', () => {
    const next = jest.fn()
    const dispatch = jest.fn()
    const getState = jest.fn()
    const action = { type: 'NORMAL' }
    middleware({ dispatch, getState })(next)(action);
    expect(next).toHaveBeenCalledWith(action);
})

it('Should execute a thunk', () => {
    const next = jest.fn()
    const dispatch = jest.fn()
    const getState = jest.fn()
    const action = jest.fn()
    middleware({ dispatch, getState })(next)(action);
    expect(action).toHaveBeenCalledWith(dispatch, getState);
})

it('Should dispatch to all connected', () => {
    const next = jest.fn()
    const dispatch = jest.fn()
    const send = jest.fn()
    const getState = jest.fn().mockImplementation(() => ({
        rtc: { room: { 
            send: send,
            numberOfConnectedUsers: 1
        }}
    }))
    const action = {
        type: 'RTC_CONNECTED',
        connected: true
    }
    middleware({ dispatch, getState })(next)(action);
    expect(getState).toHaveBeenCalled();
    expect(send).toHaveBeenCalledWith(action);
    expect(next).toHaveBeenCalledWith(action);
})

it('Should warn user if no peers are connected', () => {
    console.warn = jest.fn();
    const next = jest.fn()
    const dispatch = jest.fn()
    const send = jest.fn()
    const getState = jest.fn().mockImplementation(() => ({
        rtc: { room: { 
            send: send,
            numberOfConnectedUsers: 0
        }}
    }))
    const action = {
        type: 'RTC_CONNECTED',
        connected: true
    }
    middleware({ dispatch, getState })(next)(action);
    expect(getState).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith("No room found, saving action");
    expect(next).toHaveBeenCalledWith(action);
})

it('Should warn user if reducer is not named rtc', () => {
    console.warn = jest.fn();
    const next = jest.fn()
    const dispatch = jest.fn()
    const send = jest.fn()
    const getState = jest.fn().mockImplementation(() => ({
        rt: { room: { 
            send: send,
            numberOfConnectedUsers: 1
        }}
    }))
    const action = {
        type: 'RTC_CONNECTED',
        connected: true
    }
    middleware({ dispatch, getState })(next)(action);
    expect(getState).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith("The Redux RTC reducer must be added to state as 'rtc'");
    expect(next).toHaveBeenCalledWith(action);
})