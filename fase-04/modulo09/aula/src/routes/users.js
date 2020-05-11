const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')

const Validator = require('../app/validators/user')

// routes.get('/login', SessionController.loginForm)
// routes.post('/login', SessionController.login)
// routes.post('/logout', SessionController.logout)

// routes.get('/forgot-password', SessionController.forgotForm)
// routes.get('/password-reset', SessionController.resetForm)
// routes.post('/forgot-password', SessionController.forgot)
// routes.post('/logout', SessionController.reset)

routes.get('/register', UserController.registerForm)
routes.post('/register', Validator.post, UserController.post)

routes.get('/', UserController.show)
// routes.put('/', UserController.update)
// routes.delete('/', UserController.delete)

module.exports = routes