const { body, cookie } = require("express-validator");
const UsersModel = require("../models/UsersModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.registerValidation = [
  body("email")
    .trim()
    .escape()
    .isEmail()
    .withMessage("invalid email")
    .normalizeEmail()
    .bail()
    .custom(async (value) => {
      const user = await UsersModel.findOne({ where: { email: value } });
      if (user) throw new Error("email already used");
      return true;
    }),
  body("password")
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage("password min 6 characters"),
  body("confPassword").custom((value, { req }) => {
    if (value !== req.body.password)
      throw new Error("confirmation password not match");
    return true;
  }),
];

exports.loginValidation = [
  body("email")
    .custom(async (value, { req }) => {
      const user = await UsersModel.findOne({ where: { email: value } });
      if (!user) throw new Error("user not found");
      req.password = user.password;
      return true;
    })
    .bail({ level: "request" }),
  body("password").custom(async (value, { req }) => {
    const match = value && (await bcrypt.compare(value, req.password));
    if (!match) throw new Error("password wrong");
    return true;
  }),
];

exports.forgotPasswordValidation = [
  body("email").custom(async (value) => {
    const user =
      value && (await UsersModel.findOne({ where: { email: value } }));
    if (!user) throw new Error("email not found");
    return true;
  }),
];

exports.resetPasswordValidation = [
  cookie("forgotPasswordToken")
    .custom(async (value, { req }) => {
      const decoded =
        value && jwt.verify(value, process.env.FORGOT_PASSWORD_TOKEN);
      if (!decoded) throw new Error("forbidden");
      const user = await UsersModel.findOne({
        where: { forgotPasswordToken: value },
      });
      if (!user) throw new Error("forbidden");
      req.token = decoded.emailToken;
      return true;
    })
    .bail({ level: "request" }),
  body("emailToken")
    .custom((value, { req }) => {
      if (req.token !== parseInt(value)) throw new Error("token invalid");
      return true;
    })
    .bail({ level: "request" }),
  body("newPassword")
    .trim()
    .escape()
    .isLength({ min: 6 })
    .withMessage("password min 6 characters"),
  body("confPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword)
      throw new Error("confirmation password not match");
    return true;
  }),
];
