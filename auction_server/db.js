const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
const conxnURL = dbConfig.conxnURL + "/" + dbConfig.dbName;

mongoose.connect(
  conxnURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  function (err, done) {
    if (err) {
      console.log("Error connecting to the database", err);
    } else {
      console.log("db connection successfull");
    }
  }
);
