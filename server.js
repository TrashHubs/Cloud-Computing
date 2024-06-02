require('dotenv').config();

const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8080;

const users = require("./routes/users");
const articles = require("./routes/articles");

const app = express();
app.use(express.static(__dirname))
app.use(cors())
app.use(express.json())

app.use('/users', users);
app.use('/articles', articles);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
