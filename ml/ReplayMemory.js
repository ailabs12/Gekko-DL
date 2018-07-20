var _ = require('lodash');
var model = require('../ml/models/model');
const tf = require('@tensorflow/tfjs');
var EventEmitter = require('events').EventEmitter;
var moment = require('moment');
 
var server = new EventEmitter;

const REWARD_DECAY_RATE = 0.97;

var ReplayMemory =function(memlen) {
  this.rewards = {rewardsArray: [], rewardsStates: []}
  this.qValuesArray = [];
  this.qValuesArrayOld = [];
  this.qErrorArray = [];
  this.statesArray = [];
  this.datesArray = [];
  this.actionsArray = [];
  this.memoryLength = memlen;
  _.bindAll(this);
  this.model = model;
  this.lastTrade
  this.firstTradeIndex = 0;
  this.lastTradeIndex = 0;


  //test
}

ReplayMemory.prototype.processRoundTrip = function(roundtrip) {

    // we will cut out the data after the last closing trade was made
    // this will allow us to use data with properly calculated rewards
    var indexFirst = null;
    var indexSecond = null;
    for(i = 0; i<this.datesArray.length; i++){
        if(this.datesArray[i].unix() >= roundtrip.entryAt.unix()  && !indexFirst){
            indexFirst = i;
        }
        if(this.datesArray[i].unix() >= roundtrip.exitAt.unix()  && !indexSecond){
            indexSecond = i;
        }
    }
    //log the profit at the end of each roundtrip
    this.rewards.rewardsArray[indexSecond] = roundtrip.profit/100;
    //propagates the rewards through the whole roundtrip
    for(i=indexSecond-1; i>= indexFirst; i--){
        this.rewards.rewardsArray[i] = this.rewards.rewardsArray[i+1] * REWARD_DECAY_RATE
    }
}

//Logs Q-Values into replay memory
ReplayMemory.prototype.LogQValues = function(QValues){
    var length = this.qValuesArray.length;
    this.qValuesArray[length] = Array.from(QValues);
    
    this.actionsArray[length] = FindMax(QValues);
}

//Logs States into replay memory
ReplayMemory.prototype.LogStates = function(state){
    var length = this.statesArray.length;
    this.statesArray[length] = state;
    
}

//Logs Dates into replay memory
ReplayMemory.prototype.LogDates = function(marketData){
    var length = this.datesArray.length;
    this.datesArray[length] = marketData[2].start;

}


//Performs backsweep through replay memory and updates rewards and Q-Values
ReplayMemory.prototype.RMBackSweep = function(){
    //Fills up the empty rewards array values 

    for(i=this.statesArray.length-1; i>=0; i--){
        if(!this.rewards.rewardsArray[i]){
            this.rewards.rewardsArray[i]=0;
        }
    }

    // Update all Q-values in the replay-memory.
    // When states and Q-values are added to the replay-memory, the
    // Q-values have been estimated by the Neural Network. But we now
    // have more data available that we can use to improve the estimated
    // Q-values, because we now know which actions were taken and the
    // observed rewards. We sweep backwards through the entire replay-memory
    // to use the observed data to improve the estimated Q-values.



    //create deep copy of the q values array
    for(i=0; i<this.qValuesArray.length; i++){
        this.qValuesArrayOld[i] = Array.from(this.qValuesArray[i]);   
    }



    //updates the q values for each state
    //ready to be used for teaching the model
    lengthOfMemory = this.statesArray.length -1;
    action = this.actionsArray[lengthOfMemory]
    reward = this.rewards.rewardsArray[lengthOfMemory]
    actionValue = reward
    this.qValuesArray[lengthOfMemory][action] = actionValue;
    this.qValuesArray[lengthOfMemory][this.actionsArray[lengthOfMemory]] = actionValue + this.qValuesArray[lengthOfMemory][this.actionsArray[lengthOfMemory]];
    for(i=lengthOfMemory-1; i>=0; i--){
        action = this.actionsArray[i+1]
        qValue = this.qValuesArrayOld[i+1][action]
        reward = this.rewards.rewardsArray[i+1]
        actionValue = reward + REWARD_DECAY_RATE*qValue
        this.qValuesArray[i][this.actionsArray[i]] = actionValue;
    }


}

//Pulls random batch from replay memory
//Size of the batch passed as a variable to function
ReplayMemory.prototype.RandomBatch = function(batchSize){

}

//Runs data through model to get Q values
ReplayMemory.prototype.GetQValues = async function(NNInput){
    var data = await model.predict(tf.tensor2d(NNInput,[1,9])).data();
    return data
}

//Teaches model on data passed to it
ReplayMemory.prototype.TeachModel = function(){

}


module.exports = ReplayMemory;

FindMax = function(arr){
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}