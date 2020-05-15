const User = require('../models/User')

const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
    loginForm(req, res) {
        return res.render("session/login")
    },
    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect("/users")
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect('/')      
    },
    forgotForm(req, res) {
        return res.render("session/forgot-password")
    },
    async forgot(req, res) {
        const user = req.user

        try{
            const token = crypto.randomBytes(20).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours() + 1)
    
            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })
    
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Password recover',
                html: `<h2>Lost your key?</h2>
                <p>Don't worry, click in the link bellow to recover your password</p>
                <p>
                    <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                        PASSWORD RECOVER
                    </a>
                </p>
                `,
            })

            return res.render("session/forgot-password", {
                success: "Check your email to reset password!"
            })
        }catch(err) {
            console.error(err)
            return res.render("session/forgot-password", {
                error: "Error, try again!"
            })
        }
    },
    resetForm(req, res) {
        return res.render("session/password-reset", { token: req.query.token})
    },
    async reset(req, res) {
        const user  = req.user

        const {  password, token } = req.body

        try{
            const newPassword = await hash(password, 8)

            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            return res.render("session/login", {
                user : req.body,
                success: "Password updated! Sign in."
            })
        }catch(err) {
            console.error(err)
            return res.render("session/password-reset", {
                user: req.body,
                token,
                error: "Error, try again"
            })
        }
    }
}