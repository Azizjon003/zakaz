const dotenv = require("dotenv").config();
const app = require("./middlewares/app");
require("./config/database");


app.listen(process.env.PORT, process.env.SERVER_URL, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
