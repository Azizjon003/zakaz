const mongoose = require("mongoose");
const dotenv = require("dotenv").config({ path: "./../.env" });

mongoose
  .connect(process.env.DATABASE_URL, {})
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });
