const { compare } = require('bcryptjs')

const User = require('../models/User')

async function login(req, res, next) {
    let { email, password } = req.body

    try{
        const user = await User.findOne({ where: {email} })
    
        if(!user) return res.render("session/login", {
            user: req.body,
            error: "Usuário não registrado"
        })

        const passed = await compare(password, user.password)

        if(!passed) return res.render("session/login", {
            user: req.body,
            error: "Password mismatch."
        })
    
        req.user = user
        
        next()
    }catch(err) {
        console.error(err)
        return res.render("session/login", {
            user: req.body,
            error: "Algo deu errado"
        })
    }
}

async function forgot(req, res, next) {
    const { email } = req.body
 
    try {
        let user = await User.findOne({ where: { email }})
    
        if(!user) return res.render("session/forgot-password", {
            user: req.body,
            error: "Email não registrado"
        })

        req.user = user
        
        next()
    }catch(err) {
        console.error(err)
        return res.render("session/forgot-password", {
            user: req.body,
            error: "Algo deu errado"
        })
    }
}

async function reset(req, res, next) {
    try {
        const { email, password, token, passwordRepeat } = req.body

        const user = await User.findOne({ where: { email }} )
    
        if(!user) return res.render("session/password-reset", {
            user: req.body,
            token,
            error: "Usuário não registrado"
        })
    
        if(password != passwordRepeat) return res.render("session/password-reset", {
            user: req.body,
            token,
            error: 'Senhas não correspondem'
        })
    
        if(token != user.reset_token) return res.render("session/password-reset", {
            user: req.body,
            token,
            error: 'Token inválido! Tente novamente'
        })
    
        let now = new Date()
        now = now.setHours(now.getHours())
    
        if(now > user.reset_token_expires) return res.render("session/password-reset", {
            user: req.body,
            token,
            error: 'Token expirou! Solicite o formulário de resetar a senha novamente'
        })
    
        req.user = user
    
        next()
    } catch (error) {
        console.error(error)
        return res.render("session/password-reset", {
            user: req.body,
            token,
            error: "Algo deu errado"
        })
    }
}

module.exports = {
    login,
    forgot,
    reset
}