const Recipe = require('../models/recipe')
const { date } = require('../../lib/utils')

module.exports = {
    index(req, res) {
        return res.render("admin/recipes/index")
    },
    
    create(req, res) {
        Recipe.chefsSelectOptions(function(options){
            return res.render("admin/recipes/create", { chefsOptions: options })
        })
    },
    
    post(req, res) {
        const keys = Object.keys(req.body)
    
        for(key of keys) {
           if(req.body[key] == "")  {
               return res.send('Please, fill all fields')
           }
        }
    
        Recipe.create(req.body, function(recipe) {
            return res.redirect(`/admin/recipes/${recipe.id}`)
        })
    },
    
    show(req, res) {
        const { id } = req.params
    
        const foundRecipe = data.recipes.find(function(recipe) {
            return id == recipe.id
        })
    
        if(!foundRecipe) return res.send("Recipe not found")
    
        const recipe = {
            ...foundRecipe,
        }
        return res.render("admin/recipes/show", { item: recipe })
    },
    
    edit(req, res) {
        const { id } = req.params
    
        const foundRecipe = data.recipes.find(function(recipe) {
            return id == recipe.id
        })
    
        if(!foundRecipe) return res.send("Recipe not found")
    
        const recipe = {
            ...foundRecipe,
        }
    
        return res.render('admin/recipes/edit', { item: recipe }) 
    },
    
    put(req, res) {
        const { id } = req.body
        let index = 0
    
        const foundRecipe = data.recipes.find(function(recipe, foundIndex) {
            if(id == recipe.id) {
                index = foundIndex
                return true
            }
        })
    
        if(!foundRecipe) return res.send("Recipe not found")
    
        const recipe = {
            ...foundRecipe,
            ...req.body,
            id: Number(req.body.id)
        }
    
        data.recipes[index] = recipe
    
        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
            if(err) return res.send("Write file error")
    
            return res.redirect(`/admin/recipes/${id}`)
        })
    },
    
    delete(req, res) {
        const { id } = req.body
        
        const filteredRecipes = data.recipes.filter(function(recipe) {
            return recipe.id != id
        })
    
        data.recipes = filteredRecipes
    
        fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
            if(err) return res.send("Write file error")
    
            return res.redirect("/admin/recipes")
        })
    }

}
