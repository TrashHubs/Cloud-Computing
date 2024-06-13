const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { predictModel, getAllPredictions, getPredictionsId } = require('../controller/modelController');


router.post('/predict',upload.single('image'), predictModel);
router.get('/predictions', getAllPredictions);
router.get('/predictions/:id', getPredictionsId);


module.exports = router;
