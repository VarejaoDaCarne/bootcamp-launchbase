const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
    loginForm(req, res) {
        return res.render("session/login")
    },
    login(req, res) {
        req.session.userId = req.user.id
       
        return res.render("admin/users/show")
    },
    forgotForm(req, res) {
        return res.render("session/forgot-password")
    },
    resetForm(req, res) {
        return res.render("session/password-reset", { token: req.query.token})
    }
}