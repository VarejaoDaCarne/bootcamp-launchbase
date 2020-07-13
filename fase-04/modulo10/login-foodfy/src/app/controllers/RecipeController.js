const Recipe = require('../models/Recipe')
const RecipeFiles = require('../models/RecipeFiles')
const File = require('../models/Files')
const { files } = require('../models/Recipe')

module.exports = {
    async index(req, res) {
        let results = await Recipe.all()         
        const recipes = results.rows

        results = await File.all()
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        results = await RecipeFiles.all()
        const ids = results.rows

        return res.render("admin/recipes/index", { recipes, files, ids })
    },
    async create(req, res) {
        let results =  await Recipe.chefsSelectOptions()
        const options = results.rows
            
        return res.render("admin/recipes/create", { chefOptions: options })  
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)
            const { userId: id} = req.session
    
            for(key of keys) {
               if(req.body[key] == "")  {
                    return res.render("admin/recipes/create", {
                        recipe: req.body,
                        error: "Please, fill all fields!"
                    })
               }
            }

            if(req.files.length == 0) {
                return res.send('Please, send at least one image')
            }

            const filesPromise = req.files.map(file => File.create({
                ...file
            }))
            const resultsFile = await (await Promise.all(filesPromise)).map(file => file.rows[0].id)

            const results = await Recipe.create(req.body)
            const receitaId = results.rows[0].id
            
            resultsFile.map(id => RecipeFiles.create(receitaId, id))
            console.log(receitaId)
            return res.redirect(`/admin/recipes/${receitaId}`)

            // if(req.files.length == 0)
            //     return res.render("admin/recipes/create", {
            //         recipe: req.body,
            //         error: "Please, send at least one image'"
            //     })
            
            // let results = await Recipe.create({
            //     ...req.body,
            //     user_id: id 
            // })
    
            // const recipeId = results.rows[0].id
    
            // let filesId = []      
                
            // const filesPromise = req.files.map(async file => await File.create({...file}))
            // await Promise.all(filesPromise)
            //     .then(function(findId) {
            //         for (let index in findId) {
    
            //             let getId = findId[index].rows[0];
            //             filesId.push(getId.id)
            //         }            
            //     })
    
            
            // for (let fileId of filesId) {
            //     await RecipeFiles.create({recipe_id: recipeId, file_id: fileId})                  
            // }
            
            // return res.redirect(`recipes/${recipeId}`)
        }catch(err) {
            console.error(err)
            return res.render("admin/users/create", {
                recipe: req.body,
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
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)
            for(key of keys) {
               if(req.body[key] == "" && key != "removed_files" && key !="photos")  {
                return res.render("admin/recipes/edit", {
                    recipe: req.body,
                    error: "Please, fill all fields!"
                })
               }
            }
          
            // if(req.files.length == 0) {
            //     return res.send('Please, send at least one image')
            // }

            // const filesPromise = req.files.map(file => File.create({
            //     ...file
            // }))
            // const resultsFile = await (await Promise.all(filesPromise)).map(file => file.rows[0].id)

            // const results = await Recipe.create(req.body)
            // const receitaId = results.rows[0].id
            // console.log(receitaId)
            // resultsFile.map(id => RecipeFiles.create({recipe_id: receitaId, file_id: id}))
            // console.log(req.body)
            // await Recipe.update(req.body)

            // return res.redirect(`/admin/recipes/${receitaId}`)
            
            let filesId = []
    
            if(req.files.length != 0) {
                const newFilesPromise = req.files.map(async file => 
                    await File.create({...file}))
    
                    await Promise.all(newFilesPromise)
                        .then(function(findId) {
                            for (let index in findId) {
            
                                let getId = findId[index].rows[0];
                                filesId.push(getId.id)
                            }            
                        })
            }
    
  

            if(req.files.length !=0){
                const newFilesPromise = req.files.map(file => File.create({...file}))
                const resultsFile = await (await Promise.all(newFilesPromise)).map(file => file.rows[0].id)
                resultsFile.map(id => RecipeFiles.create(req.body.id, id))
            }
    
            if(req.body.removed_files){
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
    
                let removedFilesPromise = removedFiles.map(id => File.recipeDelete(id))
                await Promise.all(removedFilesPromise)
                removedFilesPromise = removedFiles.map(id => RecipeFiles.delete(id))
                await Promise.all(removedFilesPromise)
            }
            await Recipe.update(req.body)
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
