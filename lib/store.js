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
      assign(store.state, change)
      store.publish(change)
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

