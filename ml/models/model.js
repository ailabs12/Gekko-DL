const tf = require('@tensorflow/tfjs');

var model = tf.sequential();


model.add(tf.layers.dense(
  {units: 10,  inputShape: [9], kernelInitializer: 'varianceScaling', activation: 'softmax'}));
model.add(tf.layers.dense(
  {units: 10, kernelInitializer: 'varianceScaling', activation: 'softmax'}));
model.add(tf.layers.dense(
  {units: 10, kernelInitializer: 'varianceScaling', activation: 'softmax'}));
model.add(tf.layers.dense(
  {units: 10, kernelInitializer: 'varianceScaling', activation: 'softmax'}));
model.add(tf.layers.dense(
  {units: 3, kernelInitializer: 'varianceScaling', activation: 'softmax'}));

const LEARNING_RATE = 0.15;
const optimizer = tf.train.sgd(LEARNING_RATE);
model.compile({
  optimizer: optimizer,
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});

module.exports = model;