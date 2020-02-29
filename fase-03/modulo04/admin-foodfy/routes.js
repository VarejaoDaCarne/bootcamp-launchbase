const express = require('express')
const routes = express.Router()
const foodfy = require('./controllers/foodfy')
const recipes = require('./controllers/recipes')

routes.get('/', function(req, res) {
    return res.redirect("/index")
})

routes.get("/index", foodfy.index); 
routes.get("/about", foodfy.about); 
routes.get("/recipes", foodfy.recipes); 
routes.get("/recipes/:id", foodfy.show); 

routes.get("/admin", recipes.index);
routes.get("/admin/create", recipes.create); 
routes.get("/admin/:id", recipes.show); 
routes.get("/admin/:id/edit", recipes.edit) 

routes.post("/admin", recipes.post);
routes.put("/admin", recipes.put);
routes.delete("/admin", recipes.delete);

module.exports = routes