const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b748040c391e7e",
      pass: "f02b9b7edb884e"
    }
  });

