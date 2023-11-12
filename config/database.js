const sequelize = require("sequelize");
require("dotenv").config();

const db = new sequelize.Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

module.exports = db;
