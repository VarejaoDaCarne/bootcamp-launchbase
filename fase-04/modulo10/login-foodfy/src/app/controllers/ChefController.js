const Chef = require('../models/Chef')
const File = require('../models/Files')
const Recipe = require('../models/Recipe')

module.exports = {
    async index(req, res) {
        let results = await Chef.all()
        const chefs = results.rows

        if(!chefs) return res.send("Chefs not found")
    
        async function getImage(chefid) {
            let results = await Chef.files(chefid)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const chefsPromise = chefs.map(async chef => {
            chef.img = await getImage(chef.file_id)
            return chef
        }).filter((chef, index) => index > 10 ? false: true)

        const lastAdded = await Promise.all(chefsPromise)
        
        return res.render("admin/chefs/index", { chefs: lastAdded })
    },
    create(req, res) {
        return res.render("admin/chefs/create")
    },
    async post(req, res) { 
        try {
            let results,
            filesId = []

            const keys = Object.keys(req.body)
            for(key of keys) {
                if(req.body[key] == "" && key != "removed_files")  {
                    return res.render("admin/chefs/create", {
                        recipe: req.body,
                        error: 'Please, fill all fields'
                    })
                }
            }

            if(req.files != "" && req.files.length == 0) {
                return res.render(`admin/chefs/create`, {
                    chef: req.body,
                    error: 'Please, send at least one image'
                })
            }else {
                const filesPromise = req.files.map(file => File.create({...file}))
                await Promise.all(filesPromise)
                .then(function(getId) {
                    for (let index in getId) {
                        filesId.push(getId[index].rows[0].id)
                    }            
                })    
            }

            if(req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
    
                const removedFilesPromise = removedFiles.map(async id => await File.chefDelete(id))            
            
                await Promise.all(removedFilesPromise)
            }

            filesId.map(async fileId => {
                results = await Chef.create({...req.body, file_id: fileId})
                const chefId = results.rows[0].id
    
                return res.redirect(`/admin/chefs/${chefId}`)
            })
        }catch(err) {
            console.error(err)
            return res.render("admin/chefs/create", {
                recipe: req.body,
                error: "Something went wrong!"
            })
        }
    },
    async show(req, res) {
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if(!chef) return res.send("Chef not found!")

        results = await Chef.recipesChef(chef.id)
        const recipes = results.rows

        async function getImage(recipesId) {
            let results = await Recipe.files(recipesId)
            const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)

            return files[0]
        }

        const recipesPromise = recipes.map( async recipe => {
            recipe.src = await getImage(recipe.id)

            return recipe
        })

        const recipeFiles = await Promise.all(recipesPromise)

        results = await Chef.files(chef.file_id)
        const file = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/chefs/show", { chef, recipes, file, recipeFile: recipeFiles })       
    },
    async edit(req, res) {
        let results = await Chef.find(req.params.id)
        const chef = results.rows[0]

        if(!chef) return res.send("Chef not found!")

        results = await Chef.files(chef.file_id)
        const file = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("admin/chefs/edit", { chef, file })
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)
            for(key of keys) {
               if(req.body[key] == ""  && key != "removed_files")  {
                    return res.render("admin/chefs/edit", {
                        chef: req.body,
                        error: 'Please, fill all fields'
                    })
               }
            }
            
            if(req.files.length != 0) {
                const newFilesPromise = req.files.map(async file => 
                await File.create({...file}))

                await Promise.all(newFilesPromise)
                .then(function(findId) {
                    for (let index in findId) {
                        req.body.file_id = findId[index].rows[0].id
                    }            
                })

                await Chef.update(req.body)
            }else if(req.body.removed_files != "" && req.files[0] == undefined){
                return res.render(`admin/chefs/edit`, {
                    chef: req.body,
                    error: 'Please, send at least one image'
                })
            } 

            if(req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',')
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
    
                const removedFilesPromise = removedFiles.map(async id => await File.chefDelete(id))            
            
                await Promise.all(removedFilesPromise)
            }

            await Chef.update({ name: req.body.name})

            return res.redirect(`/admin/chefs/${req.body.id}`)
        }catch(err) {
            console.error(err)
            return res.render("admin/chefs/edit", {
                chef: req.body,
                error: "Something went wrong!"
            })
        }
    },
    async delete(req, res) {
        try {
            let results = await Chef.recipesChef(req.body.id)
            const chefHasRecipes = results.rowCount

            if(chefHasRecipes) {
                return res.send('Chef with one or more recipe(s) cannot be deleted')
            } else {
                await Chef.delete(req.body.id)

                return res.redirect(`/admin/chefs`)
            }
        }catch(err) {
            console.error(err)
            return res.render("admin/chefs/edit", {
                recipe: req.body,
                error: "Something went wrong!"
            })
        }
    }
}