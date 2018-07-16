'use strict'
var crypto = require('crypto');
var Promise = require('bluebird');
var uuid = require('uuid');

var sha256hash = function(buf){
    return crypto.createHash('sha256').
        update(buf).
        digest()
}

var makeDoubleHashUUID = exports.makeDoubleHashUUID = function(buf){
    return uuid.v4({
        random: sha256hash(sha256hash(buf))
    })
}

var createKeyPair = exports.createKeyPair = function(){
    return new Promise(function(resolve, reject){
        var needByte = 32;
        crypto.randomBytes(needByte, function(err, buf){
            if (err) reject(err);
            else resolve({
                    key: makeDoubleHashUUID(buf),
                    secret: buf.toString('hex'),
                })
        });
    })
}

var sign = exports.sign = function(argo, secret, data){
    var hmac = crypto.createHmac(argo, secret);
    return hmac.update(data).digest('hex')
}

var check = exports.check = function(argo, signdata, secret, data){
    return sign(argo, secret, data) === signdata
}

