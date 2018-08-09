var util = require('../core/util');
var log = require('../core/log');
var _ = require('lodash');
var ParserAll = require ('../ml/tradeParser')
//var tradeSender = require('../ml/tradeSender')
var ReplayMemory = require('../ml/ReplayMemory')
const moment = require('moment')

var config = util.getConfig();
var exchange = config.watch.exchange; // get marketname
//console.log(typeof exchange);
var currency = config.watch.currency; // get ...
//console.log(typeof currency);
var asset = config.watch.asset;

var ClickHouse = require('@apla/clickhouse');

// Let's create our own strat
var strat = {};

const NUMBER_OF_CANDLES = 3;

//tName = makeTable();   // New table name

strat.init = function() {
  this.input = 'candle';
  this.currentTrend = 'hold';
  this.requiredHistory = 3;
  this.ReplayMemory = new ReplayMemory;
  this.ParserAll = new ParserAll;
  //this.tradeSender = new tradeSender;
  this.qReturn = [];
  this.state = []
  this.oldTrend;
  this.toUpdate = false;
  this.marketData = []
  this.querry 

  this.options = {
    host: "172.17.4.102",
    queryOptions: {
      //profile: "web",
      database: "gekkoStat",

    },
    omitFormat: false
  };
  this.clickHouse = new ClickHouse (this.options);


}

// What happens on every new candle?
strat.update = async function(candle) {
    this.oldTrend = this.currentTrend;
    //console.log('\n\n START!!!! \n\n')
    //compose state
    if(this.marketData.push(candle) > NUMBER_OF_CANDLES){
        this.marketData.shift()
    }
    
    this.querry =  this.ParserAll.makeQuerry(candle, exchange, currency, asset);
    console.log(this.querry);

    this.clickHouse.query (this.querry, function (err, info) {
        if(err){
            console.log("did not send trades")
            console.log(err);
        }else{
            console.log("trades sent");
        }
    })

    
    
     //this.tradeSender.sendData(this.querry)
}

// For debugging purposes.
strat.log = function() {
  
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = async function() {

    this.state = await composeBatch(this.marketData);
    //run data through model
    this.qReturn = await this.ReplayMemory.GetQValues(this.state);
    //save state
    this.ReplayMemory.LogStates(this.state);

    this.ReplayMemory.LogDates(this.marketData)
    //save q-values
    this.ReplayMemory.LogQValues(this.qReturn);
    //use q-values to make decision
    this.currentTrend = takeAction(this.qReturn)

    if(this.currentTrend == 'long') {
        this.advice('long');
        //console.log("long");
    }else if(this.currentTrend == 'short'){
        this.advice('short');
        //console.log("short");
    }else if(this.currentTrend == 'hold'){
        //console.log("long");
    }
}

strat.end = async function() {

    await this.ReplayMemory.RMBackSweep();
    //console.log('*** TeachModel ***');
    await this.ReplayMemory.TeachModel();
        
}   

strat.logTrade = function(trade){

}

function composeBatch (marketData){
    var NNInput = []
    for(i = 0; i < NUMBER_OF_CANDLES; i++ ){
        NNInput[3*i] = marketData[i].high;
        NNInput[3*i+1] = marketData[i].low;
        NNInput[3*i+2] = marketData[i].volume;  
    }
    return NNInput; 
}

//this function sorts through Q values and  chouses the action to take
function takeAction (QV){
    var Qsize = QV[0]
    var counter = 0;
    for(i=0; i<2; i++){
        if(Qsize < QV[i+1]){
            counter = i+1;
            Qsize = QV[i]
        }
    }
    counter = Math.floor(3*Math.random())
    if(counter == 0){
        return "long";
    }else if(counter == 1){
        return "short";
    }else if(counter == 2){
        return "hold";
    }
}

/*
function makeTable() {

    selfRandom = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.options = {
        host: "172.17.4.102",
        queryOptions: {
          //profile: "web",
          database: "candles",
    
        },
        omitFormat: false
      };
      this.clickHouse = new ClickHouse (this.options);
   
    var tableName = "candle" + selfRandom(1, 1000);
    var createQuery = "CREATE TABLE IF NOT EXISTS " + tableName + " AS candle001";
    this.clickHouse.query(createQuery, function (err, info) {
            if(err){
                console.log("NOT CREATED. THIS TABLE IS YET")
                console.log(err);
            }else{
                console.log("TABLE CREATED "+ tableName);
        }
        });
    
    return tableName; 
} */



module.exports = strat;
