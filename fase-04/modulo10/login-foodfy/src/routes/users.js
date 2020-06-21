const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/ProfileController')
const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

const SessionValidator = require('../app/validators/session')
const UserValidator = require('../app/validators/users')

const { isLoggedRedirectToUsers, onlyUserOrAdmin  } = require('../app/middlewares/session')

routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

routes.get('/admin/profile/:id', onlyUserOrAdmin, UserValidator.show, ProfileController.index) 
routes.put('/admin/profile', UserValidator.update, ProfileController.put)

routes.get('/admin/users/register', onlyUserOrAdmin, UserController.registerForm)
routes.get('/admin/users', UserController.list)
routes.get('/admin/users/:id', onlyUserOrAdmin, UserValidator.show, UserController.show)

routes.post('/admin/users', onlyUserOrAdmin, UserValidator.post, UserController.post)
routes.put('/admin/users', onlyUserOrAdmin, UserValidator.update, UserController.put) 
routes.delete('/admin/users', onlyUserOrAdmin, UserValidator.remove,UserController.delete)

module.exports = routes