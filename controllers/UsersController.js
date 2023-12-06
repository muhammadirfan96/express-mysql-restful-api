const UsersModel = require("../models/UsersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailer");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array() });

  try {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await UsersModel.create({
      email: req.body.email,
      password: hashPassword,
    });
    return res.status(201).json({ message: "new user registered" });
  } catch (error) {
    console.error(error);
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array() });

  try {
    const user = await UsersModel.findOne({
      where: { email: req.body.email },
    });

    const payload = { id: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
      expiresIn: "30s",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
      expiresIn: "1d",
    });
    await UsersModel.update(
      { refreshToken: refreshToken },
      { where: { email: user.email } }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: req.protocol == "https" ? true : false,
    });
    return res.status(200).json(accessToken);
  } catch (error) {
    console.error(error);
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const decoded =
      refreshToken && jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    if (!decoded) return res.sendStatus(403);

    const user = await UsersModel.findByPk(decoded.id);
    if (!user) return res.sendStatus(403);

    const payload = { id: user.id, email: user.email };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, {
      expiresIn: "60s",
    });
    return res.status(200).json(accessToken);
  } catch (error) {
    console.error(error);
  }
};

exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array() });

  try {
    const randomDigit =
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

    const user = await UsersModel.findOne({ where: { email: req.body.email } });

    const forgotPasswordToken = jwt.sign(
      { id: user.id, email: user.email, emailToken: randomDigit },
      process.env.FORGOT_PASSWORD_TOKEN,
      { expiresIn: "180s" }
    );

    await UsersModel.update(
      { forgotPasswordToken: forgotPasswordToken },
      { where: { email: user.email } }
    );

    res.cookie("forgotPasswordToken", forgotPasswordToken, {
      httpOnly: true,
      maxAge: 180 * 1000,
      secure: req.protocol == "https" ? true : false,
    });

    const mailOPtions = {
      from: "expressnodemailer72@gmail.com",
      to: req.body.email,
      subject: "token reset password",
      text: `${randomDigit}`,
    };

    transporter.sendMail(mailOPtions, (error, info) => {
      if (error)
        return res
          .status(500)
          .json({ message: "fail to send token to current email" });
      return res
        .status(200)
        .json({ message: "success sending token to current email" });
    });
  } catch (error) {
    console.error(error);
  }
};

exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array() });

  try {
    const forgotPasswordToken = req.cookies.forgotPasswordToken;
    if (!forgotPasswordToken) return res.sendStatus(403);
    const user = await UsersModel.findOne({
      where: { forgotPasswordToken: forgotPasswordToken },
    });
    if (!user) return res.sendStatus(403);
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(req.body.newPassword, salt);
    jwt.verify(
      user.forgotPasswordToken,
      process.env.FORGOT_PASSWORD_TOKEN,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);
        if (parseInt(req.body.emailToken) !== decoded.emailToken)
          return res.status(404).json({ message: "invalid token" });
        await UsersModel.update(
          { password: passwordHash, forgotPasswordToken: null },
          { where: { email: decoded.email } }
        );
      }
    );
    res.clearCookie("forgotPasswordToken");
    return res.status(200).json({ message: "password updated" });
  } catch (error) {
    console.error(error);
  }
};

exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const decoded =
      refreshToken && jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    if (!decoded) return res.sendStatus(403);

    const user = await UsersModel.findByPk(decoded.id);
    if (!user) return res.sendStatus(403);

    await UsersModel.update({ refreshToken: null }, { where: { id: user.id } });

    res.clearCookie("refreshToken");
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
  }
};

exports.showUser = async (req, res) => {
  try {
    const response = await UsersModel.findByPk(req.params.id);
    if (!response) return res.status(404).json({ message: "data not found" });
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
};

exports.findUser = async (req, res) => {
  try {
    const email = req.query.email ?? "";

    const where = {
      email: {
        [Op.like]: `%${email}%`,
      },
    };

    const limit = parseInt(req.query.limit ?? 10);
    const page = parseInt(req.query.page ?? 1);
    const offset = limit * page - limit;

    const data = await UsersModel.findAndCountAll({
      where: where,
      limit: limit,
      offset: offset,
    });
    const response = {
      total: data.count,
      page: page,
      data: data.rows,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
  }
};

exports.deleteUser = async (req, res) => {
  const response = await UsersModel.findByPk(req.params.id);
  if (!response) return res.status(404).json({ message: "data not found" });
  await UsersModel.destroy({ where: { id: req.params.id } });
  return res.status(200).json({ message: "data deleted" });
};
