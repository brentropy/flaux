'use strict'

var pubsub = require('./pubsub')
var createCall = require('./call')

function pass() {
  return arguments
}

function createActions(obj) {
  return Object.keys(obj).reduce(function(memo, key) {
    memo[key] = createAction(obj[key], memo)
    return memo
  }, {})
}

function createArgsFn(action, context) {
  return function () {
    var applyArgs = Array.prototype.slice.call(arguments, 0)
    applyArgs.unshift(context)
    var argsFn = Function.bind.apply(action, applyArgs)
    argsFn.args = createArgsFn(argsFn, context)
    return argsFn
  }
}

function createAction(objOrFunc, context) {
  var type = typeof objOrFunc

  if (type === 'object' && objOrFunc !== null) {
    return createActions(objOrFunc)
  } else if (type !== 'function' || !objOrFunc) {
    throw new TypeError('createdAction() called with an invalid argument')
  }
  
  var func = objOrFunc
  var subscribers = []

  var action = function() {
    var callContext = createCall(context)
    try {
      pubsub.publish(subscribers, func.apply(callContext, arguments))
      callContext._remove()
    }
    catch (e) {
      callContext._deferred.reject(e)
    }
    return callContext._deferred.promise
  }.bind(context)

  action.subscribe = pubsub.subscribe.bind(null, subscribers)
  action.unsubscribe = pubsub.unsubscribe.bind(null, subscribers)
  action.args = createArgsFn(action, context)

  return action
}

module.exports = createActions

