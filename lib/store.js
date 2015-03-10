'use strict'

var pubsub = require('./pubsub')
var assign = require('object-assign')

function createStore(methods) {
  var subscribers = []

  var store = {
    subscribe: pubsub.subscribe.bind(null, subscribers),
    unsubscribe: pubsub.unsubscribe.bind(null, subscribers),
    state: {},

    setState: function(change) {
      var newState = {}
      assign(newState, store.state, change)
      store.publish(newState, change)
      store.state = newState
    }
  }
  
  Object.keys(methods).forEach(function(key) {
    if (typeof methods[key] === 'function') {
      store[key] = methods[key].bind(store)
    }
  })

  return store
}

module.exports = createStore

