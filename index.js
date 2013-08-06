var Emitter = require('emitter');
var store = require('store');
var each = require('each');

/**
 * Session Object. It's basically a simplified model
 * that contains key, value pairs. When a value is set,
 * a change is emitted. Listeners can react accordingly.
 * These changes are also stored in localstorage.
 */

function Session(){
  if (!(this instanceof Session)) return new Session();
  this.attributes = {};
}

Emitter(Session.prototype);

Session.prototype.set = function(key, value, options){
  options = options || {};
  var prev = this.attributes[key];
  this.attributes[key] = value;
  if (!options.dontStore) store(key, value);
  if (!options.silent) this.emit('change:'+ key, value, prev);
};

Session.prototype.get = function(key){
  return this.attributes[key];
};

Session.prototype.unset = function(key){
  this.set(key, null);
};

Session.prototype.clear = function(){
  var self = this;
  each(this.attributes, function(key){
    self.unset(key);
  });
};

Session.prototype.setDefault = function(key, value, options){
  if (!this.restored) this.restore();
  if (!this.attributes[key]) this.set(key, value, options);
  return this;
};

Session.prototype.restore = function(silent){
  var self = this;
  var storage = store();
  each(storage, function(key, val){
    self.set(key, val, { dontStore : true });
  });
  this.restored = true;
};

module.exports = Session;