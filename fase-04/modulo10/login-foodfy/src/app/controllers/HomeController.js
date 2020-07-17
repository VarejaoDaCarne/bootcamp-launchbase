const Home = require("../models/Home")
const Recipe = require('../models/Recipe')
const Chef = require("../models/Chef")

module.exports = {
    async index(req, res) {
        try {
            let results = await Recipe.all()         
            const recipes = results.rows
    
            if(!recipes) {
                return res.render("home/index", {
                    error: "Receitas não foram encontradas"
                })
            }
        
            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
    
                return files[0]
            }
    
            const recipesPromise = recipes.map(async recipe => {
                recipe.img = await getImage(recipe.id)
                return recipe
            }).filter((recipe, index) => index > 6 ? false: true)
    
            const lastAdded = await Promise.all(recipesPromise)
    
            return res.render("home/index", { recipes: lastAdded })
        } catch (error) {
            console.error(error)
            return res.render("home/index", {
                recipes: lastAdded,
                error: "Algo deu errado"
            })
        }
       
    },
    about(req, res) {
        return res.render("home/about")
    },
    async recipes(req, res) {
        try {
            let results = await Recipe.all()         
            const recipes = results.rows
    
            if(!recipes) {
                return res.render("home/recipes", {
                    error: "Receitas não foram encontradas"
                })
            }
    
            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
    
                return files[0]
            }
    
            const recipesPromise = recipes.map(async recipe => {
                recipe.img = await getImage(recipe.id)
                return recipe
            }).filter((recipe, index) => index > 12 ? false: true)
    
            const lastAdded = await Promise.all(recipesPromise)
    
            return res.render("home/recipes", { recipes: lastAdded })
        } catch (error) {
            console.error(error)
            return res.render("home/recipes", {
                recipes: lastAdded,
                error: "Algo deu errado"
            })
        }
    
    },
    async show(req, res) {
        try {
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]
    
            if(!recipe) {
                return res.render("home/recipes-show", {
                    error: "Receitas não foram encontradas"
                })
            }
                 
            results = await Recipe.files(recipe.id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
    
            return res.render("home/recipes-show", { recipe, files })
        } catch (error) {
            console.error(error)
            return res.render("home/recipes-show", {
                recipe,
                files,
                error: "Algo deu errado"
            })
        }
    
    },
    async chefs(req, res) {
        try {
            let results = await Chef.all()
            const chefs = results.rows
    
            if(!chefs) {   
                return res.render("home/chefs", {
                    error: "Algo deu errado"
                })
            }

            async function getImage(chefid) {
                let results = await Chef.files(chefid)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
    
                return files[0]
            }
    
            const chefsPromise = chefs.map(async chef => {
                chef.img = await getImage(chef.file_id)
                return chef
            }).filter((chef, index) => index > 12 ? false: true)
    
            const lastAdded = await Promise.all(chefsPromise)
            
            return res.render("home/chefs", { chefs: lastAdded })
        } catch (error) {
            console.error(error)
            return res.render("home/chefs", {
                chefs: lastAdded,
                error: "Algo deu errado"
            })
        }
       
    },
    async search(req, res) {
        try {
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
        } catch (error) {
            console.error(error)
        } 
    }
}