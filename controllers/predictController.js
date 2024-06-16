const { bucket } = require("../config/firebaseConfig");

const Predict = require("../models/predictModel");
const User = require("../models/userModel");

const loadModel = require("../services/loadModel");
const inference = require("../services/inferenceService");

const { v4: uuidv4 } = require("uuid");
const { format } = require('date-fns');

const multer = require("multer");
const storage = multer({
  storage: multer.memoryStorage(),
  fileSize: 1 * 1024 * 1024
}).single('image');

const predictModel = async (req, res) => {
  storage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: "Failed to upload image!"
      })
    }

    const userId = req.user.uid;

    const id = uuidv4();
    const image = req.file;

    const now = new Date();
    const createdAt = format(now, 'yyyy-MM-dd HH:mm:ss');

    if (!image) {
      return res.status(400).json({
        error: true,
        message: "Image file is required",
      });
    } else if (image.size > 1e6) {
      return res.status(413).json({
        error: true,
        message: "Image size must not exceed 1 MB!",
      });
    }

    try {
      const user = await User.findById(userId);

      if (user.roles == "user") {
        const model = await loadModel();
        const imageBuffer = image.buffer;

        const { label, recyclePercentage, suggestion, explanation } = await inference( model, imageBuffer );

        const fileName = `${image.originalname}-${Date.now()}`;
        const folderName = "predictions";

        const filePath = `${folderName}/${fileName}`;
        const file = bucket.file(filePath);

        await file.save(imageBuffer, {
          metadata: { contentType: image.mimetype },
        });

        await file.makePublic();
        const imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

        const predict = new Predict(id, label, suggestion, explanation, recyclePercentage.toFixed(2), imageUrl, userId, createdAt);
        await Predict.save(predict);

        return res.status(201).json({
          error: false,
          message: "Model is predicted successfully!",
          predictionResult: predict,
        })

      } else {
        return res.status(401).json({
          error: true,
          message: "You do not have permission to predict!",
        });
      }

    } catch (error) {
      const model = await loadModel();
      const imageBuffer = image.buffer;

      const errorMessage = await inference( model, imageBuffer );
      return res.status(400).json({
        error: true,
        message: errorMessage
      })
    }
  })
}

const getAll = async (req, res) => {
  const userId = req.user.uid;

  try {
    const user = await User.findById(userId);

    if (user.roles == "user") {
      const predictions = await Predict.findAll(userId);
      return res.status(200).json({
        error: false,
        message: "Successfully get predictions!",
        predictionResults: predictions,
      })

    } else {
      return res.status(401).json({
        error: true,
        message: "You do not have permission to perform this action!"
      })
    }
    
  } catch (error) {
    return res.status(404).json({
      error: true,
      message: "Predictions not found!",
    })
  }
}

const getById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.uid;

  try {
    const user = await User.findById(userId);

    if (user.roles == "user") {
      const prediction = await Predict.findById(id, userId);

      if (!prediction) {
        return res.status(404).json({
          error: true,
          message: "Prediction not found!"
        })

      } else {
        res.status(200).json({
          error: false,
          message: "Successfully get prediction!",
          predictionResult: prediction
        })
      }

    } else {
      return res.status(401).json({
        error: true,
        message: "You do not have permission to perform this action!"
      })
    }

  } catch (error) {
    return res.status(400).json({
      error: true,
      message: "Failed to get prediction: " + error.message
    })
  }
}

module.exports = { predictModel, getAll, getById };
