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
                subject: 'Conta ',
                html: `<h2>Acessar o sistema</h2>
                <p>Sua conta foi criada com sucesso!
                <br/><br/>
                Sua senha é: ${password}
                <br/><br/>
                Clique no link abaixo para acessar sua conta:</p>
                <p>
                    <a href="http://localhost:3000/login" target="_blank">
                        ACESSAR A CONTA
                    </a>
                </p>
                `,
            })
            
            req.session.destroy()

            return res.render('session/login', {
                success: "Conta criada com sucesso"
            })
        }catch(err) {
            console.error(err)
            return res.render("admin/users/show", {
                user: req.body,
                error: "Algo deu errado"
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
                success: "Conta atualizada com sucesso"
            })
        }catch(err) {
            console.error(err)
            return res.render("admin/users/show", {
                user: req.body,
                error: "Algo deu errado"
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
                success: "Conta deletada com sucesso"
            })
        }catch(err) {
            console.error(err)
            return res.render("admin/users/show", {
                user: req.body,
                error: "Algo deu errado"
            })
        }
    }
}