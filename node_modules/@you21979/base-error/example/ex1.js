var util = require('util');
var BaseError = require('..')

var DeepError = function(message, error_type, error_code, debug) {
    BaseError.call(this, message)
    this.error_type = error_type || 'GENERIC';
    this.error_code = error_code || -1;
    this.debug = undefined;
};
util.inherits(DeepError, BaseError);

// 使用
var err = new DeepError("test");
console.log(err); // true


