const express = require('express')
const routes = express.Router()
const foodfy = require('./app/controllers/foodfy')
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')

routes.get('/', function(req, res) {
    return res.redirect("/index")
})

routes.get("/index", foodfy.index); 
routes.get("/about", foodfy.about); 
routes.get("/recipes", foodfy.recipes); 
routes.get("/recipes/:id", foodfy.show); 
routes.get("/chefs/:id", foodfy.chefShow); 
routes.get("/chefs", foodfy.chefs)
routes.get("/search", foodfy.search)

routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create); 
routes.get("/admin/recipes/:id", recipes.show); 
routes.get("/admin/recipes/:id/edit", recipes.edit) 

routes.post("/admin/recipes", recipes.post);
routes.put("/admin/recipes", recipes.put);
routes.delete("/admin/recipes", recipes.delete);

routes.get("/admin/chefs", chefs.index);
routes.get("/admin/chefs/create", chefs.create); 
routes.get("/admin/chefs/:id", chefs.show); 
routes.get("/admin/chefs/:id/edit", chefs.edit) 

routes.post("/admin/chefs", chefs.post);
routes.put("/admin/chefs", chefs.put);
routes.delete("/admin/chefs", chefs.delete);

module.exports = routes