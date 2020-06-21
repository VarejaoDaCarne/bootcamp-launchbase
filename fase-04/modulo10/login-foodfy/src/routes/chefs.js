const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ChefController = require('../app/controllers/ChefController')

const { onlyUserOrAdmin } = require('../app/middlewares/session')

routes.get("/chefs", ChefController.index);
routes.get("/chefs/create", onlyUserOrAdmin, ChefController.create); 
routes.get("/chefs/:id", ChefController.show); 
routes.get("/chefs/:id/edit", onlyUserOrAdmin, ChefController.edit) 

routes.post("/chefs", multer.array("photos", 1), onlyUserOrAdmin, ChefController.post);
routes.put("/chefs", multer.array("photos", 1), onlyUserOrAdmin, ChefController.put);
routes.delete("/chefs", onlyUserOrAdmin, ChefController.delete);

module.exports = routes