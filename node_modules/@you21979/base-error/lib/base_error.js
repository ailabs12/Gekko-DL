'use strict';
var util = require("util")

var BaseError = module.exports = function (message) {
    Error.captureStackTrace(this, this.constructor);
    this.message = message || 'Error';
    this.name    = this.constructor.name;
};
util.inherits(BaseError, Error);

