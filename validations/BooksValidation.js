const { body } = require("express-validator");
exports.createValidation = [
  body("title")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("title required")
    .bail()
    .isString()
    .withMessage("title must string"),
  body("author")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("authot required")
    .bail()
    .isString()
    .withMessage("author must string"),
  body("publisher")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("publisher required")
    .bail()
    .isString()
    .withMessage("publisher must string"),
  body("price")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("price required")
    .bail()
    .isNumeric()
    .withMessage("price must numeric"),
];
