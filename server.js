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

  const model = await loadModel();
  app.locals.model = model;
  
  app.use(cors());
  app.use(bodyParser.json({ limit: '1mb' }));
  
  app.use('/models', routes);

  app.use((err, req, res, next) => {
    if (err instanceof InputError) {
      res.status(err.statusCode).json({
        status: 'fail',
        message: `${err.message}`,
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

  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  });

  app.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`);
  });
})();
