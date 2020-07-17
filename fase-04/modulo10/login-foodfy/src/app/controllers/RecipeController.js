const Recipe = require('../models/Recipe')
const RecipeFiles = require('../models/RecipeFiles')
const File = require('../models/Files')

module.exports = {
    async index(req, res) {
        try {
            let results = await Recipe.all()         
            const recipes = results.rows
    
            if(!recipes) {
                return res.render(`admin/recipes/index`, {
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
            }).filter((recipe, index) => index > 10 ? false: true)
    
            const lastAdded = await Promise.all(recipesPromise)

            return res.render("admin/recipes/index", { recipes: lastAdded })
        } catch (error) {
            console.error(error)
            return res.render(`admin/recipes/index`, {
                recipes: lastAdded,
                error: "Algo deu errado"
            })
        }
    },
    async create(req, res) {
        try {
            let results =  await Recipe.chefsSelectOptions()
            const options = results.rows
                
            return res.render("admin/recipes/create", { chefOptions: options })  
        } catch (error) {
            console.error(error)
            return res.render('admin/recipes/create', {
                error: 'Algo deu errado'
            })
        }
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
                        error: "Por favor, preencha todos os campos"
                    })
               }
            }

            if(req.files.length == 0) {
                return res.render(`admin/recipes/create`, {
                    recipe: req.body,
                    chefOptions: options,
                    error: 'Por favor, envie pelo menos uma imagem'
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

            results = await Recipe.all()         
            const recipes = results.rows
    
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
      
            return res.render(`admin/recipes/index`, {
                recipes: lastAdded,
                success: 'Receita criada com sucesso'
            })
        }catch(err) {
            console.error(err)
            return res.render(`admin/recipes/create`, {
                recipe: req.body,
                chefOptions: options,
                error: "Algo deu errado"
            })
        }
    },
    async show(req, res) {
        try {
            let results =  await Recipe.find(req.params.id)
            const recipe = results.rows[0]
    
            if(!recipe) {
                return res.render(`admin/recipes/show`, {
                    error: "Receita não foi encontrada"
                })
            }
            
            results = await Recipe.files(recipe.id)
            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
      
            return res.render("admin/recipes/show", { recipe, files })
        } catch (error) {
            console.error(error)
            return res.render(`admin/recipes/show`, {
                recipe,
                files,
                error: "Algo deu errado"
            })
        }
      
    },
    async edit(req, res) {
        try {
            let results =  await Recipe.find(req.params.id)
            const recipe = results.rows[0]
    
            if(!recipe) {
                return res.render(`admin/recipes/edit`, {
                    error: "Receita não foi encontrada"
                })
            }
                
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
            return res.render(`admin/recipes/edit`, {
                recipe,
                chefOptions: options,
                files,
                error: "Algo deu errado"
            })
        }
    },
    async put(req, res) {
        try {
            let results,
            filesId = []      
            
            results = await Recipe.files(req.body.id)
            let files = results.rows
            files = files.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))

            results =  await Recipe.chefsSelectOptions()
            const options = results.rows

            const keys = Object.keys(req.body)
            for(key of keys) {
               if(req.body[key] == "" && key != "removed_files")  {
                    return res.render("admin/recipes/create", {
                        recipe: req.body,
                        chefOptions: options,
                        files,
                        error: "Por favor, preencha todos os campos"
                    })
               }
            }

            if(!req.files && req.files.length == 0 && req.body.removed_files == "" ) {
                return res.render(`admin/recipes/create`, {
                    recipe: req.body,
                    chefOptions: options,
                    error: 'Por favor, envie pelo menos uma imagem'
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
            
            results = await Recipe.all()         
            const recipes = results.rows
    
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
      
            return res.render(`admin/recipes/index`, {
                recipes: lastAdded,
                success: 'Receita atualizada com sucesso'
            })
        }catch(err) {
            console.error(err)
            return res.render(`admin/recipes/edit`, {
                recipe: req.body,
                chefOptions: options,
                files,
                error: "Algo deu errado"
            })
        }
    },
    async delete(req, res) {
        try {
            await Recipe.delete(req.body.id) 

            let results = await Recipe.all()         
            const recipes = results.rows
    
            if(!recipes) {
                return res.render(`admin/recipes/index`, {
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
            }).filter((recipe, index) => index > 10 ? false: true)
    
            const lastAdded = await Promise.all(recipesPromise)

            return res.render(`admin/recipes/index`, {
                recipes: lastAdded,
                success: 'Receita deletada com sucesso'
            })
        }catch(err) {
            console.error(err)
            return res.render("admin/users/edit", {
                recipe: req.body,
                error: "Algo deu errado"
            })
        }
    }
}
