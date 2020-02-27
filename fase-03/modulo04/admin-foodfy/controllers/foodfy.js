const data = require('../data.js')

exports.index = function(req, res) {
    return res.render("foodfy/index", { items: data })
}

exports.about = function(req, res) {
    return res.render("foodfy/about")
}

exports.recipes = function(req, res) {
    return res.render("foodfy/recipes", { items: data })
}

exports.recipe = function(req, res) {
    return res.render("foodfy/recipe", { item: data })
}

