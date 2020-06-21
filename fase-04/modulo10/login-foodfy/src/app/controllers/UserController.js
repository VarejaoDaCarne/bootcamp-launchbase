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

            if(req.body.is_admin == undefined)
                req.body.is_admin = false
  
            const userId = await User.create({
                ...req.body,
                password: password,
            })

            req.session.userId = userId

            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Account ',
                html: `<h2>Access the system</h2>
                <p>Your account was successfully created!
                <br/><br/>
                Your password is: ${password}
                <br/><br/>
                Click in the link bellow to access it:</p>
                <p>
                    <a href="http://localhost:3000/login" target="_blank">
                        ACCESS THE ACCOUNT
                    </a>
                </p>
                `,
            })
            
            req.session.destroy()

            return res.render('session/login', {
                success: "Account created with success"
            })
        }catch(err) {
            console.error(err)
            return res.render("admin/users/show", {
                user: req.body,
                error: "Something went wrong!"
            })
        }
    },
    async list(req, res) {
        let results = await User.all()
        const users = results.rows

        const { userId: id } = req.session

        return res.render("admin/users/index", { users, userId: id })
    },
    async show(req, res) {
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

            let results = await User.all()
            const users = results.rows
            
            return res.render("admin/users/index", {
                users: users,
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

            let results = await User.all()
            const users = results.rows

            return res.render("admin/users/index", {
                users: users,
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