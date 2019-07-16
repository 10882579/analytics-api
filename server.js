const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const DB_LINK = process.env.MONGODB_URI || 'mongodb://localhost/analyticsdb';
const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';

mongoose.connect(DB_LINK, {useNewUrlParser: true});
mongoose.connection.on("open", () => {
  console.log('DB connection made');
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, X-Auth-Token');

  next();
});

require("./src/urls")(app);

app.listen(8000, () => {
  console.log('Server is running...');
});