const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c7bae49e2e2c3c",
      pass: "8434c8f13f4794"
    }
  });

