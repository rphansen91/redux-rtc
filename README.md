ReduxRTC
--------

Peer2Peer connected states using Redux and WebRTC

[GITHUB](https://github.com/rphansen91/redux-rtc)
================= 
[DEMO](https://rphansen91.github.io/redux-rtc/) 
=================

Table of contents
=================

  * [Installation](#installation)
  * [Usage](#usage)
    * [Middleware](#middleware)
    * [Reducer](#reducer)
    * [Store](#store)
    * [Create](#create)
    * [Enter](#enter)
    * [State](#state)
    * [Dispatch](#dispatch)
  * [Conclusion](#conclusion)
  * [Dependencies](#dependencies)

Installation
============

`npm install redux-rtc -S`

Usage
=====

```js
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { connected, rtc, create, enter } from 'redux-rtc'
```

Middleware
----------

```js
const middleware = applyMiddleware(connected)
```

Reducer
-------

```js
const rootReducer = combineReducers({
    rtc: rtc, // Required namespace 'rtc'
    ...
})
```

Store
-----

```js
const store = createStore(rootReducer, middleware)
```

Create
------

```js
store.dispatch(create())
```

Once created the store will contain a token. This token is used in other clients to [`enter`](#enter) the room

Enter
-----

```js
store.dispatch(enter(ROOM_TOKEN))
```

State
-------

```js
const { rtc } = store.getState()
```
@type {object}
@property {string} token - The unique id of the connection
@property {object} room - The room instance [RTCMultiConnection](http://www.rtcmulticonnection.org/docs/)
@property {Array} streams - All of the connected media elements
@property {boolean} loading - The loading status of the room
@property {string} error - Errors will propagate here

Dispatch
--------

By default actions that are dispatched do not propagate to connected clients. To share the actions across all peers the property `connected` should be added to the action

```js
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
```

Since the action is denoted as connected, the [`Middleware`](#middleware) handles posting the message to the connection and the connected peers recieve the action and dispatch to their cooresponding stores.

Conclusion
==========

Dependencies
============

- [RTCMultiConnection](https://github.com/muaz-khan/RTCMultiConnection)