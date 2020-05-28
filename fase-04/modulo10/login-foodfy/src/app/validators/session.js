const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    const { email, password } = req.body
    console.log(password)
    const user = await User.findOne({ where: {email}})

    if(!user) return res.render("session/login", {
        user: req.body,
        error: "User not registered"
    })

    const passed = await compare(password, user.password)
    console.log(user.password)

    if(!passed) return res.render("session/login", {
        user: req.body,
        error: "Password mismatch."
    })

    req.user = user
    
    next()
}

module.exports = {
    login
}