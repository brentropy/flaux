'use strict'

jest.dontMock('../action')
var createAction = require('../action')
var pubsub = require('../pubsub')

describe('action', function() {
  describe('actionFactory()', function() {
    it('returns a function when called with a function', function() {
      var func = jest.genMockFn()
      var ret = createAction(func)
      expect(typeof ret).toBe('function')
    })

    it('returns an object if called with an object of functions', function() {
      var obj = { method: jest.genMockFn() }
      var ret = createAction(obj)
      expect(typeof ret).toBe('object')
    })
  })

  describe('wrapped function', function() {
    var context = { a: 765 }
    var func
    var action

    beforeEach(function() {
      func = jest.genMockFn()
      action = createAction(func, context)
    })

    it('calls the original function with agruments', function() {
      var argA = 47
      var argB = 74
      action(argA, argB)
      expect(func).toBeCalledWith(argA, argB)
    })

    it('calls original function with bound action context', function() {
      pubsub.publish.mockClear()
      func.mockReturnThis()
      action()
      expect(pubsub.publish.mock.calls[0][1]).toBe(context)
    })

    it('it publishes funcs return value', function() {
      var payload = {foo: 'bar'}
      pubsub.publish.mockClear()
      func.mockReturnValue(payload)
      action()
      expect(pubsub.publish.mock.calls[0][1]).toBe(payload)
    })
  })
})
