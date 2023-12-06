const jwt = require("jsonwebtoken");
const UsersModel = require("../models/UsersModel");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.sendStatus(403);
    const user = UsersModel.findOne({ where: { email: decoded.email } });
    if (!user) return res.sendStatus(403);
    req.email = user.email;
  });
  next();
};

module.exports = verifyToken;
