var _ = require('lodash');



var RLFunc =function() {
  _.bindAll(this);
}

// Logs Rewards into replay memory
RLFunc.prototype.LogReward = function(){

}

//Logs Q-Values into replay memory
//returns array of Q values
RLFunc.prototype.LogQValues = function(){

}

//Logs States into replay memory
RLFunc.prototype.LogStates = function(){

}

//Performs backsweep through replay memory and updates rewards and Q-Values
RLFunc.prototype.RMBackSweep = function(){

}