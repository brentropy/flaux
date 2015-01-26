'use strict'

jest.dontMock('../pubsub')
var pubsub = require('../pubsub')

describe('pubsub', function() {
  describe('#subscribe()', function() {
    it('adds func to subscribers', function() {
      var func = jest.genMockFunction()
      var subscribers = []
      var ret = pubsub.subscribe(subscribers, func)
      expect(subscribers).toContain(func)
      expect(ret).toBe(true)
    })

    it('does not add a function already in subscribers', function() {
      var func = jest.genMockFunction()
      var subscribers = [func]
      var ret = pubsub.subscribe(subscribers, func)
      expect(subscribers.length).toBe(1)
      expect(ret).toBe(false)
    })

    it('throws if func is not a function', function() {
      expect(pubsub.subscribe.bind(null, [], 'not a function')).toThrow()
    })
  })

  describe('#unsubscribe()', function() {
    it('removes func from subscribers', function() {
      var func = jest.genMockFunction()
      var subscribers = [func]
      var ret = pubsub.unsubscribe(subscribers, func)
      expect(subscribers.length).toBe(0)
      expect(ret).toBe(true)
    })

    it('return false if func is not already in subscribers', function() {
      var func = jest.genMockFunction()
      var subscribers = []
      var ret = pubsub.unsubscribe(subscribers, func)
      expect(ret).toBe(false)
    })
  })

  describe('#publish()', function() {
    it('calls all subscibers with payload', function() {
      var subscribers = [
        jest.genMockFunction(),
        jest.genMockFunction(),
        jest.genMockFunction()
      ]
      var payload = { foo: 'bar' }
      pubsub.publish(subscribers, payload)
      subscribers.forEach(function(subscriber) {
        expect(subscriber).toBeCalledWith(payload)
      })
    })
  })
})

