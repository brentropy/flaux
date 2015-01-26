'use strict'

var pubsub = require('./pubsub')

function pass(data) {
  return data
}

function createActionsObject(obj) {
  return Object.keys(obj).reduce(function(memo, key) {
    if (obj[key]) {
      memo[key] = createAction(obj[key], memo)
    }
    return memo
  }, {})
}

function createAction(objOrFunc, context) {
  var type = typeof objOrFunc

  if (type === 'object') {
    return createActionsObject(objOrFunc)
  } else if (type !== 'function' || !objOrFunc) {
    throw new TypeError('createdAction() called with an invalid argument')
  }
  
  var func = objOrFunc || pass
  var subscribers = []

  var action = function() {
    pubsub.publish(subscribers, func.apply(context, arguments))
  }.bind(context)

  action.subscribe = pubsub.subscribe.bind(null, subscribers)
  action.unsubscribe = pubsub.unsubscribe.bind(null, subscribers)
  action.partial = Function.bind.bind(action, context)

  return action
}

module.exports = createAction

