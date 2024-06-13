require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/models');
const loadModel = require('./service/loadModel');
const InputError = require('./exception/InputError');

(async () => {
  const app = express();
  const port = process.env.PORT;

  // Load model
  const model = await loadModel();
  app.locals.model = model;

  // Middleware
  app.use(cors());
  app.use(bodyParser.json({ limit: '1mb' }));

  // Payload size error handling middleware
  app.use((req, res, next) => {
    if (req.headers['content-length'] > 1000000) {
      return res.status(413).json({
        status: 'fail',
        message: 'Payload content length greater than maximum allowed: 1000000',
      });
    } else {
      next();
    }
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    if (err instanceof InputError) {
      res.status(err.statusCode).json({
        status: 'fail',
        message: `${err.message}.silahkan gunakan foto lain`,
      });
    } else if (err.status) {
      res.status(err.status).json({
        status: 'fail',
        message: err.message,
      });
    } else {
      next(err);
    }
  });

  // General error handling middleware
  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  });
  
  // Routes
  app.use('/models', routes);

  app.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`);
  });
})();
