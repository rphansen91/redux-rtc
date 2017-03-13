(function () {
    var Redux = window.Redux;
    var createStore = Redux.createStore;
    var combineReducers = Redux.combineReducers;
    var applyMiddleware = Redux.applyMiddleware;

    var ReduxRTC = window.ReduxRTC;
    var connected = ReduxRTC.connected;
    var rtc = ReduxRTC.rtc;
    var create = ReduxRTC.create;
    var enter = ReduxRTC.enter;

    var setTrue = function () {
        return { 
            type: 'SHARED_BOOLEAN_TRUE',
            connected: true
        }
    };
    var setFalse = function () {
        return { 
            type: 'SHARED_BOOLEAN_FALSE',
            connected: true
        }
    };
    var toggleReducer = function (state, action) {
        switch (action.type) {
            case 'SHARED_BOOLEAN_TRUE': return true;
            case 'SHARED_BOOLEAN_FALSE': return false;
            default: return state || false;
        }
    }

    var store = createStore(combineReducers({
        rtc: rtc,
        boolean: toggleReducer
    }), applyMiddleware(connected));

    var dom = {
        root: find('#root')[0],
        data: find('#data')[0],
        room: find('#room').on('keyup', inputChange)[0],
        create: find('#create').on('click', createRoom)[0],
        enter: find('#enter').on('click', enterRoom)[0],
        toggle: find('#toggle').on('click', toggleState)[0]
    }

    function inputChange (ev) {
        if (ev.target.value) {
            dom.create.disabled = true;
            dom.enter.disabled = false;
        } else {
            dom.enter.disabled = true;
            dom.create.disabled = false;
        }
    }

    function createRoom () {
        store.dispatch(create());
    }

    function enterRoom () {
        store.dispatch(enter(dom.room.value));
    }

    function toggleState () {
        const curr = store.getState().boolean;
        
        if (!curr) store.dispatch(setTrue())
        else store.dispatch(setFalse())
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

        if (state.rtc.token) dom.room.value = state.rtc.token

        const count = dom.root.children.length;
        state.rtc.streams.slice(count)
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
        if (key === 'room') return true;
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
})()