const Chef = require('../models/Chef')
const File = require('../models/Files')
const Recipe = require('../models/Recipe')

module.exports = {
    async index(req, res) {
        try {
            let results = await Chef.all()
            const chefs = results.rows
    
            if(!chefs) {
                return res.render("admin/chefs/index", {
                    error: "Chefes não foram encontrados"
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
            }).filter((chef, index) => index > 10 ? false: true)
    
            const lastAdded = await Promise.all(chefsPromise)
            
            return res.render("admin/chefs/index", { chefs: lastAdded })
        } catch (error) {
            console.error(error)
            return res.render("admin/chefs/index", {
                chefs: lastAdded,
                error: "Algo deu errado"
            })
        }
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
                        error: 'Por favor, preencha todos os campos'
                    })
                }
            }

            if(req.files != "" && req.files.length == 0) {
                return res.render(`admin/chefs/create`, {
                    chef: req.body,
                    error: 'Por favor, envie pelo menos uma imagem'
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
                await Chef.create({...req.body, file_id: fileId})
    
                results = await Chef.all()
                const chefs = results.rows
            
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
                
                return res.render("admin/chefs/index", { 
                    chefs: lastAdded,
                    success: 'Chefe criado com sucesso'
                })
            })
        }catch(err) {
            console.error(err)
            return res.render("admin/chefs/create", {
                chef: req.body,
                error: "Algo deu errado"
            })
        }
    },
    async show(req, res) {
        try {
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]
    
            if(!chef) {      
                return res.render("admin/chefs/show", {
                    error: "Chefe não foi encontrado"
                })
            }
    
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
        } catch (error) {
            console.error(error)
            return res.render("admin/chefs/show", {
                chef,
                recipes,
                files,
                recipeFile: recipeFiles,
                error: "Algo deu errado"
            })
        }
    },
    async edit(req, res) {
        try {
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]
    
            if(!chef) {
                return res.render("admin/chefs/edit", {
                    error: "Chefe não foi encontrado"
                })
            }
    
            results = await Chef.files(chef.file_id)
            const file = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
            }))
    
            return res.render("admin/chefs/edit", { chef, file })
        } catch (error) {
            console.error(error)
            return res.render("admin/chefs/edit", {
                chef,
                file,
                error: "Algo deu errado"
            })
        }
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)
            for(key of keys) {
               if(req.body[key] == ""  && key != "removed_files")  {
                    return res.render("admin/chefs/edit", {
                        chef: req.body,
                        error: 'Por favor, preencha todos os campos'
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
                    error: 'Por favor, envie pelo menos uma imagem'
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

            results = await Chef.all()
            const chefs = results.rows
        
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
            
            return res.render("admin/chefs/index", { 
                chefs: lastAdded,
                success: 'Chefe atualizado com sucesso'
            })
        }catch(err) {
            console.error(err)
            return res.render("admin/chefs/edit", {
                chef: req.body,
                error: "Algo deu errado"
            })
        }
    },
    async delete(req, res) {
        try {
            let results = await Chef.recipesChef(req.body.id)
            const chefHasRecipes = results.rowCount

            if(chefHasRecipes) {
                return res.render("admin/chefs/index", {
                    chefs: lastAdded,
                    error: 'Chefe com pelo menos uma receita não podem ser deletados'
                })
            } else {
                await Chef.delete(req.body.id)
                
                results = await Chef.all()
                const chefs = results.rows
            
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
           
                return res.render("admin/chefs/index", { 
                    chefs: lastAdded,
                    success: 'Chefe deletado com sucesso'
                })
            }
        }catch(err) {
            console.error(err)
            return res.render("admin/chefs/edit", {
                chef: req.body,
                error: "Algo deu errado"
            })
        }
    }
}