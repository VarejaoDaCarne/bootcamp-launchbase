const { age, date } = require('../../lib/utils')
const Chef = require('../models/chef')

module.exports = {
    index(req, res) {
        Chef.all(function(chefs) {
            return res.render("admin/chefs/index", { chefs })
        })
    },
    create(req, res) {
        return res.render("admin/chefs/create")
    },
    post(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
           if(req.body[key] == "")  {
               return res.send('Please, fill all fields')
           }
        }
        
        Chef.create(req.body, function(chef) {
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },
    show(req, res) {
        Chef.find(req.params.id, function(chef) {
            if(!chef) return res.send("Chef not found!")

            Chef.chefRecipes(function(recipes) {
                return res.render("admin/chefs/show", { chef, recipes })
            })
        })
    },
    edit(req, res) {
        Chef.find(req.params.id, function(chef) {
            if(!chef) return res.send("Chef not found!")

            return res.render("admin/chefs/edit", { chef })
        })
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
           if(req.body[key] == "")  {
               return res.send('Please, fill all fields')
           }
        }
        
        Chef.update(req.body, function() {
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    delete(req, res) {
        const { id } = req.body

        Chef.chefHasRecipes(id, function(chef) {
            if(chef.count == 0 || undefined) {
                Chef.delete(req.body.id, function() {
                    return res.redirect(`/admin/chefs`)
                })
            } else {
                console.log(chef.count)
                return res.send("Chefs with recipe(s) cannot be excluded")
            }
        })
    }
}