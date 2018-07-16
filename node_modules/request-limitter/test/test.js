var assert = require('assert');
var createLimitter = require('..');

describe('simple', function() {
    it('limit count check', function() {
        var MAX = 10;
        var NUM = 30;
        var check = createLimitter(MAX, 1);
        var tbl = {
            true:0,
            false:0,
        };
        for(var i=0; i<NUM; ++i){
            tbl[check()]++
        }
        assert(tbl.true === MAX)
        assert(tbl.false === NUM - MAX)
    })
})
