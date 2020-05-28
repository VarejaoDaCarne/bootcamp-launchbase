const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ChefController = require('../app/controllers/ChefController')

routes.get("/chefs", ChefController.index);
routes.get("/chefs/create", ChefController.create); 
routes.get("/chefs/:id", ChefController.show); 
routes.get("/chefs/:id/edit", ChefController.edit) 

routes.post("/chefs", multer.array("photos", 1), ChefController.post);
routes.put("/chefs", multer.array("photos", 1), ChefController.put);
routes.delete("/chefs", ChefController.delete);

module.exports = routes