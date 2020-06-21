const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')

const chefs = require('./chefs')
const recipes = require('./recipes')
const users = require('./users')

const { onlyUsers } = require('../app/middlewares/session')

routes.use('/admin', onlyUsers, chefs)
routes.use('/admin', onlyUsers, recipes)
routes.use('/', users)

routes.get("/", HomeController.index); 
routes.get("/about", HomeController.about); 
routes.get("/recipes", HomeController.recipes); 
routes.get("/recipes/:id", HomeController.show); 
routes.get("/chefs", HomeController.chefs)
routes.get("/search", HomeController.search)

module.exports = routes