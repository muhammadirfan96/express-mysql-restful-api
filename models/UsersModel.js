const db = require("../config/database");
const { DataTypes } = require("sequelize");

const UsersModel = db.define(
  "users",
  {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    forgotPasswordToken: DataTypes.STRING,
  },
  { freezeTableName: true }
);

module.exports = UsersModel;

// (async () => await db.sync())();
