'use strict';

var Promise = require('bluebird');

var sleep = module.exports = function(msec, value){
    var f = (msec === 0) ? setImmediate : setTimeout;
    return new Promise(function(resolve){
        f(function(){
            resolve(value);
        }, msec)
    })
}

