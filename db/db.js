const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

mongoose.connect(
  process.env.DB,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("sucessfully connected");
  }
);
