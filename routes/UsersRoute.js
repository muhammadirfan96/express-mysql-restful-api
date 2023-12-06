const express = require("express");
const {
  register,
  login,
  showUser,
  findUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
} = require("../controllers/UsersController");
const verifyToken = require("../midlewares/verifyToken");
const router = express.Router();
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} = require("./../validations/UsersValidation");

// auth
router.post("/user/register", registerValidation, register);
router.post("/user/login", loginValidation, login);
router.post("/user/forgot-password", forgotPasswordValidation, forgotPassword);
router.patch("/user/reset-password", resetPasswordValidation, resetPassword);
router.get("/user/refresh-token", refreshToken);
router.delete("/user/logout", logout);

// controller
router.get("/user/:id", verifyToken, showUser);
router.get("/users", verifyToken, findUser);
router.delete("/user/:id", verifyToken, deleteUser);

module.exports = router;
