const { Sequelize, DataTypes, Op } = require("sequelize");
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import cli from "cli-color";
const sequelize = new Sequelize(
  "news",
  "postgres",
  String(process.env.Password),
  {
    host: "localhost",
    dialect: "postgres",
  }
);
interface data {
  sequelize: any;
  user: any;
  channel: any;
  news: any;
}

sequelize
  .authenticate()
  .then(() => {
    console.log(cli.green("connected"));
  })
  .catch((err: any) => {
    console.log(cli.red("not connected"));
  });
let db: any = {} as data;
db.sequelize = sequelize;
db.Op = Op;
db.user = require("./user")(sequelize, DataTypes);
db.news = require("./news")(sequelize, DataTypes);
db.channel = require("./channel")(sequelize, DataTypes);
// db.sequelize
//   .sync({ alter: true, force: true })
//   .then(() => {
//     console.log(cli.green("synced"));
//   })
//   .catch((err: any) => {
//     console.log(cli.red(err));
//   });
module.exports = db;
