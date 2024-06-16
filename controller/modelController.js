const multer = require('multer');
const upload = multer();

const predict = require('../service/inferenceService');
const crypto = require('crypto');
const storeModel = require('../models/storeModel');
const InputError = require('../exception/InputError');
const { bucket } = require('../config/firebaseConfig');

async function predictModel(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) {
      throw new InputError('No image file provided ', 400);
    }

    const photo = req.file;

    if (photo.size > 1000000) {
      throw new InputError('File size exceeds 1MB', 413);
    }

    const { model } = req.app.locals;
    const imageBuffer = photo.buffer;

    const { label, recyclePercentage, suggestion, explanation } = await predict(model, imageBuffer);

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
      createdAt: createdAt,
    };

    await storeModel.save(data);

    res.status(201).json({
      status: 'success',
      message: 'Model is predicted successfully',
      predictionsResult: data,
    });
  } catch (error) {
    next(new InputError(`${error.message}`, error.statusCode || 400));
  }
}

async function getAllPredictions(req, res, next) {
  try {
    await storeModel.getAll();
    const predictions = await storeModel.getAll();
    res.status(200).json({
      status: 'success',
      message: 'Predictions fetched successfully',
      predictionsResult: predictions,
    });
  } catch (error) {
    next(new InputError(`data not found`, error.statusCode || 400));
  }
}

async function getPredictionsId(req, res, next) {
  const { id } = req.params;
  try {
    const predictions = await storeModel.getById(id);
    if (!predictions) {
      next(new InputError(`data not found`, 404));
    } else {
      res.status(200).json({
        status: 'success',
        message: 'Predictions fetched successfully',
        predictionsResult: predictions,
      });
    }
  } catch (error) {
    next(new InputError(`${error.message}`, error.statusCode || 400));
  }
}

module.exports = {
  predictModel,
  getAllPredictions,
  getPredictionsId,
};
