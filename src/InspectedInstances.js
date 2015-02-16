'use strict';

var _ = require('lodash');
var Inspector = require('./analyzer/Inspector');
var PObject = require('./analyzer/Object');
var BuiltIn = require('./analyzer/BuiltIn');
var Global = require('./analyzer/Global');
var Angular = require('./analyzer/Angular');
var libraries;

var proto = {
  /**
   * Creates a new Inspector with `config` as its configuration
   * saved in `this` as `entryPoint`
   * @param {string} entryPoint
   * @param {Object} options
   * @chainable
   */
  create: function (entryPoint, options) {
    console.log('creating a generic container for: ' + entryPoint, options);
    return (libraries[entryPoint] = new Inspector(options));
  },
  /**
   * Execute `fn` with all the properties saved in `this`
   * @param fn
   */
  all: function (fn) {
    _.forOwn(libraries, fn);
  },
  /**
   * Marks all the properties saved in `this` as dirty
   * @chainable
   */
  markDirty: function () {
    this.all(function (v) {
      v.setDirty();
    });
    return this;
  }
  //setFunctionConstructors: function (newValue) {
  //  this.all(function (v) {
  //    // this only works on the generic analyzers
  //    if (!v._hasfc) {
  //      v.analyzer.setFunctionConstructors(newValue);
  //    }
  //  });
  //  return proto;
  //}
};

libraries = Object.create(proto);
//console.log(libraries);
_.merge(libraries, {
  object: new PObject(),
  builtIn: new BuiltIn(),
  window: new Global(),
  //popular
  angular: new Angular(),
  //mine
  t3: new Inspector({ entryPoint: 't3' })
  //huge
  //three: new Inspector({
  //  global: 'THREE',
  //  rendereachtime: true
  //})
});

Inspector.instances = libraries;

module.exports = libraries;
