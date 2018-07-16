const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const timer = require('node-simple-timer');
const data = require('./data');
const model = require('./model');

const NUM_EPOCHS = 10;
const BATCH_SIZE = 100;
const TEST_SIZE = 50;

async function train() {
  let step = 0;
  while (data.hasMoreTrainingData()) {
    const batch = data.nextTrainBatch(BATCH_SIZE);
    const history = await model.fit(
        batch.image, batch.label, {batchSize: BATCH_SIZE, shuffle: true});

    if (step % 20 === 0) {
      const loss = history.history.loss[0].toFixed(6);
      const acc = history.history.acc[0].toFixed(4);
      console.log(`  - step: ${step}: loss: ${loss}, accuracy: ${acc}`);
    }
    step++;
  }
  return step;
}

async function test() {
  if (!data.hasMoreTestData()) {
    data.resetTest();
  }
  const evalData = data.nextTestBatch(TEST_SIZE);
  const output = model.predict(evalData.image);
  const predictions = output.argMax(1).dataSync();
  const labels = evalData.label.argMax(1).dataSync();

  let correct = 0;
  for (let i = 0; i < TEST_SIZE; i++) {
    if (predictions[i] === labels[i]) {
      correct++;
    }
  }
  const accuracy = ((correct / TEST_SIZE) * 100).toFixed(2);
  console.log(`* Test set accuracy: ${accuracy}%\n`);
}

async function run() {
  const totalTimer = new timer.Timer();
  totalTimer.start();

  await data.loadData();

  const epochTimer = new timer.Timer();
  for (let i = 0; i < NUM_EPOCHS; i++) {
    epochTimer.start();
    const trainSteps = await train();
    epochTimer.end();
    data.resetTraining();

    const time = epochTimer.seconds().toFixed(2);
    const stepsSec = (trainSteps / epochTimer.seconds()).toFixed(2);
    console.log(
        `* End Epoch: ${i + 1}: time: ${time}secs (${stepsSec} steps/sec)`);

    test();
  }

  totalTimer.end();
  const time = totalTimer.seconds().toFixed(2);
  console.log(`**** Trained ${NUM_EPOCHS} epochs in ${time} secs`);
}

run();