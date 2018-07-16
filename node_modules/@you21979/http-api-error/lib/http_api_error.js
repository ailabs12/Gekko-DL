var util = require('util');
var BaseError = require('@you21979/base-error')

function HttpApiError(message, error_type, error_code, debug) {
    BaseError.call(this, message)
    this.error_type = (error_type === undefined) ? 'GENERIC' : error_type;
    this.error_code = (error_code === undefined) ? -1 : error_code;
    this.debug = (debug === undefined) ? undefined : debug;
};
util.inherits(HttpApiError, BaseError);

module.exports = HttpApiError

