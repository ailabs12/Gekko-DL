'use strict';

var uptimeFromDate = function(){
    var timestamp = function() { return (new Date()).getTime() }
    var basetime = timestamp();
    return function(){
        return (timestamp() - basetime) / 1000
    }
}

var createUptime = module.exports = function(){
    return (typeof global === 'object') ?
        ((typeof global.process === 'object' && global.process.uptime) ? global.process.uptime : uptimeFromDate()) :
        uptimeFromDate();
}


