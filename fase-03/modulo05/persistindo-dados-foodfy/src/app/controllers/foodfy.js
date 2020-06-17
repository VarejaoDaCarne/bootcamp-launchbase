const Foodfy = require("../models/foodfy")
const Chef = require('../models/chef')

module.exports = {
    index(req, res) {
        Foodfy.allRecipes(function(recipes) {
            res.render("foodfy/index", { recipes })
        })
    },
    about(req, res) {
        return res.render("foodfy/about")
    },
    recipes(req, res) {
        Foodfy.allRecipes(function(recipes) {
            res.render("foodfy/recipes", { recipes })
        })
    },
    show(req, res) {
        Foodfy.findRecipe(req.params.id, function(recipe) {
            if(!recipe) return res.send("Recipe not found")
            return res.render("foodfy/show", { recipe })
        })
    },
    chefShow(req, res) {
        Chef.find(req.params.id, function(chef) {
            if(!chef) return res.send("Chef not found!")

            Chef.chefRecipes(function(recipes) {
                return res.render("admin/chefs/show", { chef, recipes })
            })
        })
    },
    chefs(req, res) {
        Foodfy.allChefs(function(chefs) {
            return res.render("foodfy/chefs", { chefs })
        })
    },
    search(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 9
        let offset = limit * (page -1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes) {
                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }

                return res.render("foodfy/search", { recipes, pagination, filter })
            }
        }
        Foodfy.paginate(params)
    }
}
