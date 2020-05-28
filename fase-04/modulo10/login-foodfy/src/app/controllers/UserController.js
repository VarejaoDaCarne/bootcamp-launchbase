const User = require('../models/User')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
    registerForm(req, res) {
        return res.render("admin/users/register")
    },
    async post(req, res) {
        try {
            const password = crypto.randomBytes(5).toString("hex")
            
            const userId = await User.create({
                ...req.body,
                password: password,
            })

            req.session.userId = userId

            // await mailer.sendMail({
            //     to: userId.email,
            //     from: 'no-reply@foodfy.com.br',
            //     subject: 'Account ',
            //     html: `<h2>Password</h2>
            //     <p>${password}</p>
            //     `,
            // })

            return res.redirect('/admin/users')
        }catch(err) {
            console.error(err)
        }
    },
    async list(req, res) {
        let results = await User.all()
        const users = results.rows

        return res.render("admin/users/index", { users })
    },
    show(req, res) {
        const { user } = req

        return res.render("admin/users/show", { user })
    },
    async put(req, res) {
        try {
            const { user } = req
            let { name, email, is_admin } = req.body

            if(is_admin == null) 
                is_admin = false
            
            await User.update(user.id, {
                name,
                email,
                is_admin
            })

            return res.render("admin/users/show", {
                user: req.body,
                success: "Account updated with success!"
            })
        }catch(err) {
            console.error(err)
            return res.render("admin/users/show", {
                user: req.body,
                error: "Something went wrong!"
            })
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.body.id)

            req.session.destroy()

            return res.render("admin/users/index", {
                users:  User.all(),
                success: "Account deleted with success!"
            })
        }catch(err) {
            console.error(err)
            return res.render("admin/users/show", {
                user: req.body,
                error: "Error when tried to delete account!"
            })
        }
    }
}