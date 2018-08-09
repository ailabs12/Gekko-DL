var _ = require('lodash');
var async = require('async');
var ClickHouse = require('@apla/clickhouse');

//var tName = require('../strategies/RL-learn');

//var util = require(__dirname + '/../util');
//var dirs = util.dirs();

//const cp = require(dirs.core + 'cp');

//const Json2csvParser = require('json2csv').Parser;
const fields = ['tid', 'date', 'price', 'amount', 'exchange', 'currency', 'asset'];
const opts = { fields };
//const parser = new Json2csvParser(opts);
var tradeParser = function(config){
    _.bindAll(this);
    this.config = config;
    
    //console.log(config)
}

//util.makeEventEmitter(tradeParser);

//Converts json.data to CSV object
// tradeParser.prototype.toCSV = function(json){
//     csv = parser.parse(json.data);
//     //console.log(csv);
//     this.emit('csv', csv);
// }

// Parses JSON object and appends exchange, currency and asset information to data
// tradeParser.prototype.parseJSON = function(json){

//     var len = json.data.length;
//     for (var i = 0; i < len; i++) {
//        json.data[i].exchange = this.config.watch.exchange;
//        json.data[i].currency = this.config.watch.currency;
//        json.data[i].asset = this.config.watch.asset;
//     }

//     this.emit('json', json);
// }

tradeParser.prototype.makeQuerry = function(json, exchange, currency, asset){
    
    var querry = "INSERT INTO gekkoStat.candle002";
    // "
        querry += " (IdCndl, StartCndl, OpenCndl, High, Low, CloseCndl, VWP, Volume, Trades, exchange, Currency, Asset, CndlStart) FORMAT Values ";
        querry +="(" + json.id + ", ";
        querry += "'" + json.start.format('YYYY-MM-DD') + "', ";
        querry +=json.open + ", ";
        querry +=json.high + ", ";
        querry +=json.low + ", ";
        querry +=json.close + ", ";
        querry +=json.vwp + ", ";
        querry +=json.volume + ", ";
        querry +=json.trades + ", ";
        querry += "'" + exchange + "', ";
        querry += "'" + currency + "', ";  
        querry += "'" + asset + "', ";
        querry += "'" + json.start.format('YYYY-MM-DDTHH:mm:ss') + "');";
        return querry 
}

module.exports = tradeParser;