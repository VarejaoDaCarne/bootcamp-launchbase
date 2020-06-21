const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const RecipeController = require('../app/controllers/RecipeController')

const { onlyOneOwnRecipeOrAdmin } = require('../app/middlewares/session')

routes.get("/recipes", RecipeController.index);
routes.get("/recipes/create", RecipeController.create); 
routes.get("/recipes/:id", RecipeController.show); 
routes.get("/recipes/:id/edit", onlyOneOwnRecipeOrAdmin, RecipeController.edit) 

routes.post("/recipes", multer.array("photos", 5), RecipeController.post);
routes.put("/recipes", multer.array("photos", 5), RecipeController.put);
routes.delete("/recipes", RecipeController.delete);

module.exports = routes