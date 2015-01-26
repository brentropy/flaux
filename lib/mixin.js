'use strict'

function mixinFactory(store, key) {
  var getNewState = function(change) {
    switch(keyType) {
      case 'undefined': return store.state
      case 'function': return key(store.state, change)
      case 'string':
        var newState = {}
        newState[key] = store.state
        return newState
    }
  }

  var subscriber = function(change) {
    this.setState(getNewState(change))
  }

  return {
    componentWillMount: function() {
      subscriber()
      store.subscribe(subscriber)
    },
    componentDidUnmount: function() {
      store.unsubscribe(subscriber)
    }
  }
}
