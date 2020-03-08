const express = require('express')
const routes = express.Router()
const foodfy = require('./app/controllers/foodfy')
const recipes = require('./app/controllers/recipes')

routes.get('/', function(req, res) {
    return res.redirect("/index")
})

routes.get("/index", foodfy.index); 
routes.get("/about", foodfy.about); 
routes.get("/recipes", foodfy.recipes); 
routes.get("/recipes/:id", foodfy.show); 

routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create); 
routes.get("/admin/recipes/:id", recipes.show); 
routes.get("/admin/recipes/:id/edit", recipes.edit) 

routes.post("/admin/recipes", recipes.post);
routes.put("/admin/recipes", recipes.put);
routes.delete("/admin/recipes", recipes.delete);

module.exports = routes