require('dotenv').config();

const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const PORT = 8080;

const users = require("./routes/users");
const articles = require("./routes/articles");
const pickup = require("./routes/pickup");
const predict = require("./routes/predict");

const app = express();
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/users', users);
app.use('/articles', articles);
app.use('/pickup', pickup);
app.use('/predict', predict);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
