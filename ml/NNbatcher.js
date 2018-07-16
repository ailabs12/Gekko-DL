const tf = require('@tensorflow/tfjs');
const assert = require('assert');
const fs = require('fs');
const https = require('https');
const util = require('util');
const zlib = require('zlib');
const _=require('lodash');
const readFile = util.promisify(fs.readFile)


const NUMBER_OF_CANDLES = 3;







// NNBatcher.init = function(){
//     this.rawCandles = [];

// }


async function composeBatch (marketData, candle){
    return [5];
    
    // if( marketData.push(candle) > 2){
    //     return marketData.pop();
    // }else{
    //     return marketData;
    // }
     
}


module.exports = NNBatcher;