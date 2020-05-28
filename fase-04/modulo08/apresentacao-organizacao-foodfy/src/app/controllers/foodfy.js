const Foodfy = require("../models/foodfy")
const File = require('../models/files')
const RecipeFiles = require('../models/recipeFiles')
const Recipe = require('../models/recipe')

module.exports = {
    async index(req, res) {
        let results = await Foodfy.allRecipes()
        const recipes = results.rows

        results = await File.all()
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        results = await RecipeFiles.all()
        const ids = results.rows

        res.render("foodfy/index", { recipes, files, ids })
    },
    about(req, res) {
        return res.render("foodfy/about")
    },
    async recipes(req, res) {
        let results = await Foodfy.allRecipes()
        const recipes = results.rows

        results = await File.all()
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        results = await RecipeFiles.all()
        const ids = results.rows

        res.render("foodfy/recipes", { recipes, files, ids })
    },
    async show(req, res) {
        let results = await Foodfy.findRecipe(req.params.id)
        const recipe = results.rows[0]

        if(!recipe) return res.send("Recipe not found")
             
        results = await Foodfy.recipeFiles(recipe.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("foodfy/show", { recipe, files })
    },
    async chefs(req, res) {
        let results = await Foodfy.allChefs()
        const chefs = results.rows

        results = await File.all()
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("foodfy/chefs", { chefs, files })
    },
    async search(req, res) {
        let results,
            pagination
            params = {}
            let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 3
        let offset = limit * (page -1)

        params = {
            filter,
            page,
            limit,
            offset,
        }

        results = await Foodfy.paginate(params)

        async function getImage(recipeId) {
            let results = await Recipe.files(recipeId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }
  
        const recipesPromise = results.rows.map(async recipe => {
            recipe.src = await getImage(recipe.id)
    
            return recipe
        })
    
        recipes = await Promise.all(recipesPromise)

        if(recipes[0]) {
            pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page
            }
        }

        return res.render("foodfy/search", { recipes, pagination, filter })
    }
}
