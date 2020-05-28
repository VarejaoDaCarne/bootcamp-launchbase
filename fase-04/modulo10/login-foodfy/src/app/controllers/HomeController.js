const Home = require("../models/Home")
const File = require('../models/Files')
const RecipeFiles = require('../models/RecipeFiles')
const Recipe = require('../models/Recipe')

module.exports = {
    async index(req, res) {
        let results = await Home.allRecipes()
        const recipes = results.rows

        results = await File.all()
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        results = await RecipeFiles.all()
        const ids = results.rows

        res.render("home/index", { recipes, files, ids })
    },
    about(req, res) {
        return res.render("home/about")
    },
    async recipes(req, res) {
        let results = await Home.allRecipes()
        const recipes = results.rows

        results = await File.all()
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        results = await RecipeFiles.all()
        const ids = results.rows

        res.render("home/recipes", { recipes, files, ids })
    },
    async show(req, res) {
        let results = await Home.findRecipe(req.params.id)
        const recipe = results.rows[0]

        if(!recipe) return res.send("Recipe not found")
             
        results = await Home.recipeFiles(recipe.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("home/recipes-show", { recipe, files })
    },
    async chefs(req, res) {
        let results = await Home.allChefs()
        const chefs = results.rows

        results = await File.all()
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("home/chefs", { chefs, files })
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

        results = await Home.paginate(params)

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

        return res.render("home/search", { recipes, pagination, filter })
    }
}
