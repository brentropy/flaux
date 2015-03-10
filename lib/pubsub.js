'use strict'

module.exports = {
  subscribe: function(subscribers, func) {
    if (typeof func !== 'function') {
      throw new TypeError('subscribe() error: subscriber must be a function')
    }
    if (subscribers.indexOf(func) === -1) {
      subscribers.push(func)
      return true
    }
    return false
  },

  unsubscribe: function(subscribers, func) {
    var idx = subscribers.indexOf(func)
    if (idx !== -1) {
      subscribers.splice(idx, 1)
      return true
    }
    return false
  },

  publish: function(subscribers) {
    var args = [].slice.call(arguments, 1)
    for (var i = 0, l = subscribers.length; i < l; ++i) {
      subscribers[i].apply(null, args)
    }
  }
}

