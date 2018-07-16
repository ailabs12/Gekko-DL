var _ = require('lodash');
var model = require('../ml/models/model');
const tf = require('@tensorflow/tfjs');

var ReplayMemory =function(memlen) {
  this.rewardsArray = [];
  this.qValuesArray = [];
  this.qErrorArray = [];
  this.statesArray = [];
  this.memoryLength = memlen;
  _.bindAll(this);
  this.model = model;
  
}

// Logs Rewards into replay memory
ReplayMemory.prototype.LogReward = function(revard){
    console.log("LogReward");
}

//Logs Q-Values into replay memory
ReplayMemory.prototype.LogQValues = function(QValues){
    console.log("LogQValues");
    var length = this.qValuesArray.length;
    this.qValuesArray[length] = QValues;
    console.log(QValues) 
}

//Logs States into replay memory
ReplayMemory.prototype.LogStates = function(state){
    console.log("LogStates");
    var length = this.statesArray.length;
    this.statesArray[length] = state;
    console.log(state)
}

//Performs backsweep through replay memory and updates rewards and Q-Values
ReplayMemory.prototype.RMBackSweep = function(){

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