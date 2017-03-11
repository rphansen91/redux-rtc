var Redux = window.Redux;
var createStore = Redux.createStore;
var combineReducers = Redux.combineReducers;

var ReduxRTC = window.ReduxRTC;
var reducer = ReduxRTC.reducer;
var actions = ReduxRTC.actions;
var create = ReduxRTC.create;
var enter = ReduxRTC.enter;
var dispatchAll = ReduxRTC.dispatchAll;

var setTrue = function () {
    return { type: 'SHARED_BOOLEAN_TRUE' }
};
var setFalse = function () {
    return { type: 'SHARED_BOOLEAN_FALSE' }
};
var toggleReducer = function (state, action) {
    switch (action.type) {
        case 'SHARED_BOOLEAN_TRUE': return true;
        case 'SHARED_BOOLEAN_FALSE': return false;
        default: return state || false;
    }
}

var store = createStore(combineReducers({
    rtc: reducer,
    boolean: toggleReducer
}));

var dom = {
    root: find('#root')[0],
    data: find('#data')[0],
    room: find('#room').on('keyup', inputChange)[0],
    open: find('#open').on('click', openRoom)[0],
    join: find('#join').on('click', joinRoom)[0],
    toggle: find('#toggle').on('click', toggleState)[0]
}

function inputChange (ev) {
    if (ev.target.value) {
        dom.open.disabled = true;
        dom.join.disabled = false;
    } else {
        dom.join.disabled = true;
        dom.open.disabled = false;
    }
}

function openRoom () {
    create()(store.dispatch);
}

function joinRoom () {
    enter(dom.room.value)(store.dispatch);
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
    dom.data.innerHTML = [
        '<h3>Redux State</h3>',
        '<pre>',
            JSON.stringify(state, removeStreams, 2),
        '</pre>'
    ].join('');

    if (state.rtc.connection.token) dom.room.value = state.rtc.connection.token

    const count = dom.root.children.length;
    state.rtc.connection.streams.slice(count)
    .map(function (stream) {
        dom.root.appendChild(stream.mediaElement);
        stream.mediaElement.play();
        setTimeout(function() {
            stream.mediaElement.play();
        }, 5000);
    })

    return render;
}

function removeStreams (key, value) {
    if (key === 'streams') return value.map(function (v) {
        return v.streamid;
    });
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