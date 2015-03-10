'use strict'

var assign = require('object-assign')
var Promise = require('es6-promise').Promise

function defer() {
  var deferred = {}
  deferred.promise = new Promise(function(resolve, reject) {
    deferred.resolve = resolve
    deferred.reject = reject
  })
  return deferred
}

var methods = {
  _add: function(name) {
    if (name) {
      this._namedCbs[name] = null
    }
    else {
      this._cbCount += 1
    }
    return this
  },

  _remove: function(name) {
    if (name) {
      delete this._namedCbs[name]
    }
    else {
      this._cbCount -= 1
    }
    if (Object.keys(this._namedCbs).length === 0 && this._cbCount === 0) {
      this._deferred.resolve()
    }
    return this
  },

  waitFor: function(action, name) {
    this._add(name)
    return function() {
      var promise = action.args.apply(null, arguments)()
      promise
        .then(function() {
          this._remove(name)
        }.bind(this))
        .catch(this._deferred.reject)
    }.bind(this)
  }
}

function createCall(context) {
  return assign(Object.create(context), methods, {
    _deferred: defer(),
    _namedCbs: {},
    _cbCount: 1
  })
}

module.exports = createCall

