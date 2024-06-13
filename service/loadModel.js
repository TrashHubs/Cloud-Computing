const tfjs = require('@tensorflow/tfjs-node');

function loadModel() {
  return tfjs.loadLayersModel(process.env.MODEL_URL);
}

module.exports = loadModel;
