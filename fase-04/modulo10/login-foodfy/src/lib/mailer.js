const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "d24c11473cbf8a",
      pass: "3f0e2cbeb46a93"
    }
  });

