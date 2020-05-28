const Recipe = require('../models/recipe')
const RecipeFiles = require('../models/recipeFiles')
const File = require('../models/files')

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
        const keys = Object.keys(req.body)
    
        for(key of keys) {
           if(req.body[key] == "")  {
               return res.send('Please, fill all fields')
           }
        }

        if(req.files.length == 0)
            return res.send('Please, send at least one image')

        let results = await Recipe.create(req.body)
        const recipeId = results.rows[0].id

        let filesId = []      
            
        const filesPromise = req.files.map(async file => await File.create({...file}))
        await Promise.all(filesPromise)
            .then(function(findId) {
                for (let index in findId) {

                    let getId = findId[index].rows[0];
                    filesId.push(getId.id)
                }            
            })

        
        for (let fileId of filesId) {
            await RecipeFiles.create({recipe_id: recipeId, file_id: fileId})                  
        }

        return res.redirect(`/admin/recipes/${recipeId}`)
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
        const keys = Object.keys(req.body)

        for(key of keys) {
           if(req.body[key] == "" && key != "removed_files" && key !="photos")  {
               return res.send('Please, fill all fields')
           }
        }
      
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

        if(filesId.length != 0){
            for (let fileId of filesId) {
                await RecipeFiles.update({recipe_id: req.body.id, file_id: fileId})                  
            }
        }

        if(req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(',')
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(async id => await File.recipeDelete(id))            

            await Promise.all(removedFilesPromise)
        }      

        await Recipe.update(req.body)

        return res.redirect(`/admin/recipes/${req.body.id}`)
    },
    async delete(req, res) {
        await Recipe.delete(req.body.id) 

        return res.redirect(`/admin/recipes`)
    }
}
