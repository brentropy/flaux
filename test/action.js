var createActions = require('../lib/action')
var should = require('should')
var sinon = require('sinon')

describe('Flaux.createActions(obj)', function() {
  it('returns an object if all obj props are functions', function() {
    createActions({foo: sinon.spy()}).should.be.an.Object
  })

  it('throws when obj contains a non-function prop', function() {
    createActions.bind(null, {foo: 'bar'}).should.throw()
  })

  it('supports nested objects', function() {
    var actions = createActions({foo: {bar: sinon.spy()}})
    actions.should.be.an.Object.and.have.property('foo')
    actions.foo.should.have.property('bar')
  })

  it('returns objects with function values', function() {
    var actions = createActions({foo: sinon.spy(), bar: sinon.spy()})
    actions.foo.should.be.a.Function
    actions.bar.should.be.a.Function
  })

  describe('returned action function', function() {
    var action
    var func

    beforeEach(function() {
      func = sinon.stub()
      action = createActions({foo: func}).foo
    })

    it('should call the original function with arguments', function() {
      action(1, 2, 3)
      sinon.assert.calledWithExactly(func, 1, 2, 3)
    })

    it('publishes return value to all subscribers', function() {
      var ret = 'foo'
      func.returns(ret)
      var subscribers = [
        sinon.spy(),
        sinon.spy()
      ]
      subscribers.forEach(action.subscribe.bind(action))
      action()
      subscribers.forEach(function(subscriber) {
        sinon.assert.calledWithExactly(subscriber, ret)
      })
    })

    it('can be unsubscribed from', function() {
      var sub = sinon.spy()
      action.subscribe(sub)
      action()
      sinon.assert.calledOnce(sub)
      action.unsubscribe(sub)
      action()
      sinon.assert.calledOnce(sub)
    })

    it('can be parially applied via args', function() {
      var arg1 = 'foo'
      var arg2 = 'bar'
      var partial = action.args(arg1).args(arg2)
      partial()
      sinon.assert.calledWithExactly(func, arg1, arg2)
    })

    describe('returned promise', function(done) {
      it('resolves after publishing to subscribers', function() {
        var sub = sinon.spy()
        action.subscribe(sub)
        action().then(function() {
          sinon.assert.calledOnce(sub)
          done()
        }, done)
      })

      it('can defer resolving for async actions w/ waitFor', function(done) {
        var actions = createActions({
          init: function() {
            setImmediate(this.waitFor(this.async))
          },
          async: function() {}
        })
        var sub = sinon.spy()
        actions.async.subscribe(sub)
        actions.init().then(function() {
          try {
            sinon.assert.calledOnce(sub)
            done()
          }
          catch (err) {
            done(err)
          }
        }, done)
      })

      it('requires only one waitFor w/ a given name to resolve', function() {
        var actions = createActions({
          a: function() {
            this.waitFor(this.b, 'foo')
            this.waitFor(this.c, 'foo')()
          },
          b: function () {},
          c: function () {}
        })
        return actions.a()
      })
    })
  })
})
