const express = require('express')
const routes = express.Router()

// const ProfileController = require('../app/controllers/ProfileController')
const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

const SessionValidator = require('../app/validators/session')
const UserValidator = require('../app/validators/users')

routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
// routes.post('/login', SessionController.logout)

routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
// routes.post('/forgot-password', SessionController.forgot)
// routes.post('/password-reset', SessionController.reset)

// routes.get('/admin/profile', ProfileController.index) 
// routes.put('/admin/profile', ProfileController.put)

routes.get('/admin/users/register', UserController.registerForm)
routes.get('/admin/users', UserController.list)
routes.get('/admin/users/:id', UserValidator.show, UserController.show)

routes.post('/admin/users', UserValidator.post, UserController.post)
routes.put('/admin/users', UserValidator.update, UserController.put) 
routes.delete('/admin/users', UserController.delete)

module.exports = routes