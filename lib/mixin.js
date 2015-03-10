'use strict'

var objEql = require('obj-eql')

function createMixin(store, compFn) {
  var subscriber

  return {
    componentWillMount: function() {
      subscriber = function(newState) {
        if (!objEql(compFn, newState, store.state)) {
          this.forceUpdate()
        }
      }.bind(this)

      store.subscribe(subscriber)
    },

    componentWillUnmount: function() {
      store.unsubscribe(subscriber)
    }
  }
}

module.exports = createMixin

