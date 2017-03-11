const { createStore, combineReducers } = window.Redux;
const { reducer, actions, create, enter, dispatchAll } = window.ReduxRTC;

const setTrue = () => ({ type: 'SHARED_BOOLEAN_TRUE' });
const setFalse = () => ({ type: 'SHARED_BOOLEAN_FALSE' });
const toggleReducer = (state = false, action) => {
    switch (action.type) {
        case 'SHARED_BOOLEAN_TRUE': return true;
        case 'SHARED_BOOLEAN_FALSE': return false;
        default: return state;
    }
}

const store = createStore(combineReducers({
    rtc: reducer,
    boolean: toggleReducer
}));

const root = find('#root')[0];
const data = find('#data')[0];
const roomid = find('#roomid').on('keyup', inputChange)[0];
const open = find('#open').on('click', openRoom)[0];
const join = find('#join').on('click', joinRoom)[0];
const toggle = find('#toggle').on('click', toggleState)[0];

function inputChange (ev) {
    if (ev.target.value) {
        open.disabled = true;
        join.disabled = false;
    } else {
        join.disabled = true;
        open.disabled = false;
    }
}

function openRoom () {
    create()(store.dispatch);
}

function joinRoom () {
    enter(roomid.value)(store.dispatch);
}

function toggleState () {
    const curr = store.getState().boolean;
    
    if (!curr) dispatchAll(setTrue())(store.dispatch) 
    else dispatchAll(setFalse())(store.dispatch)
}

store.subscribe(render());

function render () {
    const state = store.getState();

    document.body.style['background-color'] = state.boolean ? 'lightblue' : 'lightgreen';
    data.innerHTML = [
        '<h3>Redux State</h3>',
        '<pre>',
            JSON.stringify(state, removeStreams, 2),
        '</pre>'
    ].join('');

    if (state.rtc.connection.token) roomid.value = state.rtc.connection.token

    const count = root.children.length;
    state.rtc.connection.streams.slice(count).map(function (stream) {
        root.appendChild(stream.mediaElement);
        stream.mediaElement.play();
        setTimeout(function() {
            stream.mediaElement.play();
        }, 5000);
    })

    return render;
}

function removeStreams (key, value) {
    if (key === 'streams') return value.map(v => v.streamid);
    return value;
}

function find (selector) {
    var element = document.querySelector(selector);
    return {
        0: element,
        on: function (event, cb) {
            element.addEventListener(event, cb);
            return this;
        }
    }
}