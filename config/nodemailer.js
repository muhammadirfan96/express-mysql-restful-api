const { createTransport } = require("nodemailer");

const transporter = createTransport({
  service: "Gmail",
  auth: {
    user: "expressnodemailer72@gmail.com",
    pass: "ijixjulnfgmunlcl",
  },
  secure: true,
  port: 465,
});

module.exports = transporter;
