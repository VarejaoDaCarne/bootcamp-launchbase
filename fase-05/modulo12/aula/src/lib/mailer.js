const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "6c82806354485b",
      pass: "81627ecbe6643b"
    }
  });

