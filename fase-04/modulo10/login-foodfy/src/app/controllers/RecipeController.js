const Recipe = require('../models/Recipe')
const RecipeFiles = require('../models/RecipeFiles')
const File = require('../models/Files')

module.exports = {
    async index(req, res) {
        try {
            let results = await Recipe.all()         
            const recipes = results.rows
    
            if(!recipes) return res.send("Recipes not found")
    
            async function getImage(recipeId) {
                let results = await Recipe.files(recipeId)
                const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
    
                return files[0]
            }
    
            const recipesPromise = recipes.map(async recipe => {
                recipe.img = await getImage(recipe.id)
                return recipe
            }).filter((recipe, index) => index > 10 ? false: true)
    
            const lastAdded = await Promise.all(recipesPromise)

            return res.render("admin/recipes/index", { recipes: lastAdded })
        } catch (error) {
            console.error(error)
        }
    },
    async create(req, res) {
        let results =  await Recipe.chefsSelectOptions()
        const options = results.rows
            
        return res.render("admin/recipes/create", { chefOptions: options })  
    },
    async post(req, res) {
        try {
            let results,
            filesId = [] 
            
            results =  await Recipe.chefsSelectOptions()
            const options = results.rows

            const keys = Object.keys(req.body)
            for(key of keys) {
               if(req.body[key] == "" && key != "removed_files")  {
                    return res.render("admin/recipes/create", {
                        recipe: req.body,
                        chefOptions: options,
                        error: "Please, fill all fields!"
                    })
               }
            }

            if(req.files.length == 0) {
                return res.render(`admin/recipes/create`, {
                    recipe: req.body,
                    chefOptions: options,
                    error: 'Please, send at least one image'
                })
            }else {
                const filesPromise = req.files.map(async file => await File.create({...file}))
                await Promise.all(filesPromise)
                .then(function(getId) {
                    for (let index in getId) {
                        filesId.push(getId[index].rows[0].id)
                    }            
                })
            }

            results = await Recipe.create({...req.body, user_id: req.session.userId})
            const recipeId = results.rows[0].id

            if(req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
                
                const removedFilesPromise = removedFiles.map(id => File.recipeDelete(id))

                await Promise.all(removedFilesPromise)
            }

            filesId.map(async fileId => {
                await RecipeFiles.create({recipe_id: recipeId, file_id: fileId})                
            })
                
            return res.redirect(`/admin/recipes/${recipeId}`)
        }catch(err) {
            console.error(err)
            return res.render(`admin/recipes/create`, {
                recipe: req.body,
                chefOptions: options,
                error: "Something went wrong!"
            })
        }
    },
    async show(req, res) {
        let results =  await Recipe.find(req.params.id)
        const recipe = results.rows[0]

        if(!recipe) return res.send("Recipe not found")
        
        results = await Recipe.files(recipe.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
  
        return res.render("admin/recipes/show", { recipe, files })
    },
    async edit(req, res) {
        try {
            let results =  await Recipe.find(req.params.id)
            const recipe = results.rows[0]
    
            if(!recipe) return res.send("Recipe not found")
                
            results = await Recipe.chefsSelectOptions()
            const options = results.rows
    
            results = await Recipe.files(recipe.id)
            let files = results.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
      
            return res.render("admin/recipes/edit", { recipe, chefOptions: options, files })
        } catch (error) {
            console.error(error)
        }
    },
    async put(req, res) {
        try {
            let results,
            filesId = []      
            
            results =  await Recipe.chefsSelectOptions()
            const options = results.rows

            const keys = Object.keys(req.body)
            for(key of keys) {
               if(req.body[key] == "" && key != "removed_files")  {
                    return res.render("admin/recipes/create", {
                        recipe: req.body,
                        chefOptions: options,
                        error: "Please, fill all fields!"
                    })
               }
            }

            if(!req.files && req.files.length == 0 && req.body.removed_files == "" ) {
                return res.render(`admin/recipes/create`, {
                    recipe: req.body,
                    chefOptions: options,
                    error: 'Please, send at least one image'
                })
            } else {
                const filesPromise = req.files.map(async file => await File.create({...file}))
                await Promise.all(filesPromise)
                .then(function(getId) {
                    for (let index in getId) {
                        filesId.push(getId[index].rows[0].id)
                    }            
                })
            }

            if(filesId.length > 0) {
                filesId.map(async fileId => { await RecipeFiles.create({recipe_id: req.body.id, file_id: fileId})})
            }
            
            if(req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
                
                const removedFilesPromise = removedFiles.map(id => File.recipeDelete(id))

                await Promise.all(removedFilesPromise)
            }
            
            await Recipe.update({...req.body})

            return res.redirect(`/admin/recipes/${req.body.id}`)
        }catch(err) {
            console.error(err)
            return res.render(`admin/recipes/edit`, {
                recipe: req.body,
                error: "Something went wrong!"
            })
        }
    },
    async delete(req, res) {
        try {
            await Recipe.delete(req.body.id) 

            return res.redirect(`/admin/recipes`)
        }catch(err) {
            console.error(err)
            return res.render("admin/users/edit", {
                recipe: req.body,
                error: "Something went wrong!"
            })
        }
    }
}
