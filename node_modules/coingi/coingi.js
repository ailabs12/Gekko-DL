const got = require('got');
const crypto = require('crypto');

// Public/Private methods
const methods = {
    public: ['order-book', 'transactions', '24hour-rolling-aggregation'],
    private: ['balance', 'add-order', 'get-order', 'cancel-order', 'orders', 'usertransactions', 'create-crypto-withdrawal'],
};

// Default options
const defaults = {
    url: 'https://api.coingi.com',
    version: 'current',
    timeout: 5000
};

// Send the API request
const rawHttpRequest = async (type, url, headers, data, timeout) => {
    // Set custom User-Agent string
    headers['User-Agent'] = 'Coingi Javascript API Client';

    const options = {headers, timeout};

    if (type === "get") {
        Object.assign(options, {
            method: 'GET'
        });
    } else if (type === "post") {
        // GSON should be used here / JSON type post
        Object.assign(options, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    const {body} = await got(url, options);
    const response = JSON.parse(body);
    handleErrorResponse(response);
    return response;
};

// Handle error responses
const handleErrorResponse = (response) => {
    if (response.errors && response.errors.length) {
        const errors = [];
        for (let error in response.errors) {
            errors.push(response.errors[error].message);
        }

        throw new Error(errors.join(' '));
    }
};

/**
 * CoingiClient connects to the coingi.com API
 * @param {String}        key               API Key
 * @param {String}        secret            API Secret
 * @param {String|Object} [options={}]      Additional options. If a string is passed, will default to just setting ``.
 * @param {Number}        [options.timeout] Maximum timeout (in milliseconds) for all API-calls (passed to `request`)
 */
class CoingiClient {
    constructor(key, secret, options) {
        if (typeof options === 'string') {
            options = {};
        }

        this.config = Object.assign({key, secret}, defaults, options);
    }

    /**
     * Generates the signature for a request
     * @param   (String) key
     * @param   (String) secret
     * @param   (String) nonce
     * @returns {String}
     */
    getMessageSignature(nonce) {
        const secret_buffer = Buffer.from(this.config.secret);
        const hmac = new crypto.createHmac('sha256', secret_buffer);
        const nonceData = Buffer.from(nonce);
        const keyData = Buffer.from(this.config.key);

        var data = Buffer.allocUnsafe(nonce.length + 1 + this.config.key.length);
        nonceData.copy(data, 0, 0, nonce.length);
        Buffer.from('$').copy(data, nonce.length, 0, 1);
        keyData.copy(data, nonce.length + 1, 0, this.config.key.length);
        const hmac_digest = hmac.update(data, 'binary').digest('hex');
        return hmac_digest.toLowerCase();
    }

    /**
     * Handle error response
     * @param response
     * @return void
     *
     * @throws Error when there is an error found in the response
     */
    handleErrorResponse(response) {
        handleErrorResponse(response);
    }

    /**
     * This method makes a public or private API request.
     * @param  {String}   method   The API method (public or private)
     * @param  {Object}   params   Arguments to pass to the api call
     * @param  {Function} callback A callback function to be executed when the request is complete
     * @return {Object}            The request object
     */
    api(method, params, callback) {
        // Default params to empty object
        if (typeof params === 'function') {
            callback = params;
            params = {};
        }

        if (methods.public.includes(method)) {
            return this.publicMethod(method, params, callback);
        } else if (methods.private.includes(method)) {
            if (method === 'usertransactions') {
                method = 'transactions';
            }

            return this.privateMethod(method, params, callback);
        } else {
            throw new Error(method + ' is not a valid API method.');
        }
    }

    /**
     * This method makes a public API request.
     * @param  {String}   method   The API method (public or private)
     * @param  {Object}   params   Arguments to pass to the api call
     * @param  {Function} callback A callback function to be executed when the request is complete
     * @return {Object}            The request object
     */
    publicMethod(method, params, callback) {
        params = params || '';

        // Default params to empty object
        if (typeof params === 'function') {
            callback = params;
            params = '';
        }

        const path = '/' + this.config.version + '/' + method;
        const url = this.config.url + path + params;
        const response = rawHttpRequest("get", url, {}, params, this.config.timeout);

        if (typeof callback === 'function') {
            response
                .then((result) => callback(null, result))
                .catch((error) => callback(error, null));
        }

        return response;
    }

    /**
     * This method makes a private API request.
     * @param  {String}   method   The API method (public or private)
     * @param  {Object}   params   Arguments to pass to the api call
     * @param  {Function} callback A callback function to be executed when the request is complete
     * @return {Object}            The request object
     */
    privateMethod(method, params, callback) {
        params = params || {};

        // Default params to empty object
        if (typeof params === 'function') {
            callback = params;
            params = {};
        }

        const path = '/user/' + method;
        const url = this.config.url + path;

        if (!params.nonce) {
            params.nonce = (new Date() * 1000).toString(); // spoof microsecond
        }

        const signature = this.getMessageSignature(params.nonce);

        params['token'] = this.config.key;
        params['signature'] = signature;

        const headers = {};
        const response = rawHttpRequest("post", url, headers, params, this.config.timeout);

        if (typeof callback === 'function') {
            response
                .then((result) => callback(null, result))
                .catch((error) => callback(error, null));
        }

        return response;
    }
}

module.exports = CoingiClient;
