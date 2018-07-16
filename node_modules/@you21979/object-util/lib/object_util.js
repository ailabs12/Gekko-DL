'use strict'

var ObjectUtil = exports;

ObjectUtil.keyRemoveFilter = function(obj, keys) {
    if(!(keys instanceof Array)) keys = [keys];
    return Object.keys(obj).
        filter(function(key){
            return keys.indexOf(key) === -1
        }).
        reduce(function(res, key) {
            res[key] = obj[key]
            return res
        }, {})
}

ObjectUtil.keyMerge = function(a, b){
    var w = {};
    Object.keys(a || {}).forEach(function(key){
        w[key] = a[key]
    })
    Object.keys(b || {}).forEach(function(key){
        w[key] = b[key]
    })
    return w
}

