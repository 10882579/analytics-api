const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});
mongoose.connection.on("open", () => {
  console.log('DB connection made');
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, X-Auth-Token');

  next();
});

require("./app/urls")(app);

app.listen(8000, () => {
  console.log('Server is running...');
});