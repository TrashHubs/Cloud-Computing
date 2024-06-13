const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { predictModel } = require('../controller/modelController');


// Route to handle prediction, expecting 'image' field in form data
router.post('/predict',upload.single('image'), predictModel);

module.exports = router;
