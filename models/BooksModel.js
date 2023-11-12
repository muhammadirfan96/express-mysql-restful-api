const db = require("../config/database");
const { DataTypes } = require("sequelize");

const BooksModel = db.define(
  "books",
  {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    publisher: DataTypes.STRING,
    price: DataTypes.INTEGER,
  },
  {
    freezeTableName: true,
  }
);

module.exports = BooksModel;

// (async () => {
//   db.sync();
// })();
