var _ = require('lodash');
//var async = require('async');

//var util = require(__dirname + '/../util');
//var dirs = util.dirs();
var ClickHouse = require('@apla/clickhouse');
//const cp = require(dirs.core + 'cp');

const Sender = function(config){
    _.bindAll(this);
    //this.config = config;
    //console.log(this.config);
    
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



Sender.prototype.sendData = function(data){
    this.clickHouse.query (data, function (err, info) {
        if(err){
            console.log("did not send trades")
            console.log(err);
        }else{
            console.log("trades sent");
        }
    });
    //this.exchangeData();
    
}
// Sender.prototype.exchangeData = function(){
//     var info = "exchange: " + this.config.watch.exchange +
//                "   currency: " + this.config.watch.currency +
//                "   asset: " + this.config.watch.asset
//     console.log (info)
// }




module.exports = Sender;