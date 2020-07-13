const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "cdcba590b24f78",
      pass: "4668b5eade20f5"
    }
  });

