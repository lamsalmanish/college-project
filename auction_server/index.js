const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
const cors = require("cors");
const config = require("./configs");

// Initiating database
require("./db");

// Loading routing level middleware
const APIRoute = require("./routes/api.route");

// Third party middleware
app.use(morgan("dev"));
app.use(cors());

// Parse incoming data
// --------For x-www-formurlencoded-----------
app.use(express.urlencoded({ extended: true }));
// -----------------For Json---------------
app.use(express.json());

// Using routing level middleware to mount all request as url
app.use("/api", APIRoute);

// inbuilt middleware for serving static files
app.use(express.static("uploads/images")); // internal usage within express application
app.use("/file", express.static(path.join(__dirname, "uploads/images")));

app.use(function (req, res, next) {
  // 404 catch block
  next({
    msg: "Not found",
    status: 404,
  });
});

// Error handling middleware
app.use(function (err, req, res, next) {
  console.log("Error Handling middleware", err);
  res.status(400);
  res.json({
    msg: err.msg || err,
    status: err.status || 400,
  });
});

app.listen(config.port, function (err, done) {
  if (err) {
    console.log("error listening>>", err);
  } else {
    console.log("Server is listening at port " + config.port);
  }
});
