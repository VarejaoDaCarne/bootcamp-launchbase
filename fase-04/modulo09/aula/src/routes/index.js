const express = require('express')
const routes = express.Router()

const HomeController =require('../app/controllers/HomeController')

const products = require('./products')
const users = require('./users')

routes.get('/', HomeController.index)

routes.use('/products', products)
routes.use('/users', users)

routes.get('/ads/create', function(req, res) {
    return res.redirect("/products/create")
})

routes.get('/accounts', function(req, res) {
    return res.redirect("/users/register")
})

module.exports = routes