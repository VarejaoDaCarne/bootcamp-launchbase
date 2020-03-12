const Foodfy = require("../models/foodfy")

module.exports = {
    index(req, res) {
        Foodfy.allRecipes(function(recipes) {
            return res.render("foodfy/index", { recipes })
        })
    },
    about(req, res) {
        return res.render("foodfy/about")
    },
    recipes(req, res) {
        Foodfy.allRecipes(function(recipes) {
            return res.render("foodfy/recipes", { recipes })
        })
    },
    show(req, res) {
        Foodfy.findRecipe(req.params.id, function(recipe) {
            if(!recipe) return res.send("Recipe not found")
            return res.render("foodfy/show", { recipe })
        })
    },
    chefs(req, res) {
        Foodfy.allChefs(function(chefs) {
            return res.render("foodfy/chefs", { chefs })
        })
    }
}
