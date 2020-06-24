const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ab462a3b6acacf",
      pass: "439e3a663cd80b"
    }
  });

