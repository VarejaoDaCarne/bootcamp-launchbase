const Chef = require('../models/chef')
const File = require('../models/files')
const Recipe = require('../models/recipe')

module.exports = {
    async index(req, res) {
        let results = await Chef.all()
        const chefs = results.rows

        results = await File.all()
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/chefs/index", { chefs, files })
    },
    create(req, res) {
        return res.render("admin/chefs/create")
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

        let filesId = []

        const filesPromise = req.files.map(file => File.create({...file}))
        await Promise.all(filesPromise)
            .then(function(findId) {
                for (let index in findId) {

                    let getId = findId[index].rows[0];
                    filesId.push(getId.id)
                }            
            })

        
        for (let fileId of filesId) {
            let results = await Chef.create({...req.body, file_id: fileId})
        const chefId = results.rows[0].id

        return res.redirect(`/admin/chefs/${chefId}`)
        }
    },
    async show(req, res) {
        try {
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]   

            if(!chef) return res.send("Chef not found!")

            if(chef.file_src)
                chef.file_src = `${req.protocol}://${req.headers.host}${chef.file_src.replace("public", "")}`

            let recipes = (await Chef.recipesChef(chef.id)).rows
            const recipesFile = []

            for(const recipe of recipes) {
                let files = (await File.recipeFiles(recipe.id)).rows

                files = files.map(file => ({
                    ...file,
                    src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
                }))

                recipesFile.push({
                    ...recipe,
                    file: files
                })
            }

            recipes = recipesFile
        
            console.log(recipes)
            return res.render("admin/chefs/show", { chef, recipes })     
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if(!chef) return res.send("Chef not found!")

        if(chef.file_src)
        chef.file_src = `${req.protocol}://${req.headers.host}${chef.file_src.replace("public", "")}`
        
        return res.render("admin/chefs/edit", { chef })
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)

            for(key of keys) {
               if(req.body[key] == ""  && key != "removed_files" &&  key != "photos")  {
                   return res.send('Please, fill all fields')
               }
            }
    
            let fileId = ""

            if(req.files.length != 0) {
                const newFilesPromise = req.files.map(async file => 
                    await File.create({...file}))

                    await Promise.all(newFilesPromise)
                        .then(function(findId) {
                            for (let index in findId) {
            
                                let get = findId[index].rows[0];
                                fileId = get.id
                            }            
                        })
            }

            if(fileId)
                await Chef.update({...req.body, file_id: fileId})
            else
                await Chef.update({...req.body})

            if(req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)

                const removedFilesPromise = removedFiles.map(async id => await File.chefDelete(id))            

                await Promise.all(removedFilesPromise)
            }

            return res.redirect(`/admin/chefs/${req.body.id}`)
        } catch (error) {
            console.error(error)
        }
    },
    async delete(req, res) {
        let results = await Chef.recipesChef(req.body.id)
        const chefHasRecipes = results.rowCount

        if(chefHasRecipes) {
            return res.send('Chef with one or more recipe(s) cannot be deleted')
        } else {
            await Chef.delete(req.body.id)

            return res.redirect(`/admin/chefs`)
        }
    }
}