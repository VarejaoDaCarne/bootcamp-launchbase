const data = require('../data.json')

exports.index = function(req, res) {
    return res.render("foodfy/index", { items: data.recipes })
}

exports.about = function(req, res) {
    return res.render("foodfy/about")
}

exports.recipes = function(req, res) {
    return res.render("foodfy/recipes", { items: data.recipes })
}

exports.show = function(req, res) {
    const { id } = req.params

    const foundRecipe = data.recipes.find(function(recipe) {
        return id == recipe.id -1
    })

    if(!foundRecipe) return res.send("Recipe not found")

    const recipe = {
        ...foundRecipe,
    }
    return res.render("foodfy/show", { item: recipe })
}

