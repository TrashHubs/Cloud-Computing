const tfjs = require('@tensorflow/tfjs-node');
const InputError = require('../exception/InputError');

async function predict(model, imageBuffer) {
  try {
    // Decode and preprocess the image
    const tensor = tfjs.node.decodeImage(imageBuffer).resizeNearestNeighbor([180, 180]).expandDims().toFloat();

    // Make prediction
    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classes = ['battery', 'biological', 'brown-glass', 'cardboard', 'clothes', 'green-glass', 'metal', 'paper', 'plastic', 'shoes', 'trash', 'white-glass'];

    const recyclable = {
      battery: false,
      biological: false,
      'brown-glass': true,
      cardboard: true,
      clothes: true,
      'green-glass': true,
      metal: true,
      paper: true,
      plastic: true,
      shoes: false,
      trash: false,
      'white-glass': true,
    };

    const classResult = tfjs.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];
    let explanation, suggestion, recyclePercentage;

    if (recyclable[label]) {
      explanation = `${label} is recyclable.`;
      suggestion = `Please dispose of ${label} in the recycling bin.`;
      recyclePercentage = confidenceScore;
    } else {
      explanation = `${label} is not recyclable.`;
      suggestion = `Please dispose of ${label} in the regular trash bin.`;
      recyclePercentage = 0;
    }

    return { confidenceScore, label, recyclePercentage, suggestion, explanation };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan dalam proses prediksi gunakan foto lain`);
  }
}

module.exports = predict;
