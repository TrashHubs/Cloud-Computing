const multer = require('multer');
const upload = multer();

const predict = require('../service/inferenceService');
const crypto = require('crypto');
const InputError = require('../exception/InputError');
const { db, bucket } = require('../config/firebaseConfig');

async function predictModel(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) {
      throw new InputError('No image file provided', 400);
    }

    const photo = req.file;

    // Check file size
    if (photo.size > 1000000) {
      throw new InputError('File size exceeds 1MB', 413);
    }

    const { model } = req.app.locals;
    const imageBuffer = photo.buffer;

    // Run the prediction
    const { confidenceScore, label, recyclePercentage, suggestion, explanation } = await predict(model, imageBuffer);

    // Upload image to Cloud Storage only after successful prediction
    const fileName = `${photo.originalname}-${Date.now()}`;
    const folderName = 'predictions';
    const filePath = `${folderName}/${fileName}`;
    const file = bucket.file(filePath);

    await file.save(photo.buffer, {
      metadata: { contentType: photo.mimetype },
    });

    await file.makePublic();
    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      explanation: explanation,
      imageUrl: imageUrl,
      recyclePercentage: recyclePercentage.toFixed(2),
      confidenceScore: confidenceScore.toFixed(2),
      createdAt: createdAt,
    };

    // Save metadata to Firestore
    await db.collection('predictions').doc(id).set(data);

    res.status(201).json({
      status: 'success',
      message: 'Model is predicted successfully',
      data,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: `Terjadi kesalahan dalam melakukan prediksi gunakan foto lain`,
    });
  }
}

module.exports = {
  predictModel,
};
