const db = require('../../config/db')

module.exports = {
    allRecipes() {
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`)
    },
    allChefs() {
        return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes 
        FROM chefs 
        LEFT JOIN recipes on (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        ORDER BY total_recipes DESC`)
    },
    findRecipe(id) {
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id])
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM recipes
            ) AS total`

        if(filter) {
            filterQuery = `
            WHERE recipes.title ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            ) AS total`
        }

        query = `
        SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ${filterQuery}
        LIMIT $1 OFFSET $2 
        `

        db.query(query, [limit, offset], function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    recipeFiles(id) {
        return db.query(`
        SELECT files.*, recipe_id, file_id
        FROM files
        LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
        WHERE recipe_id = $1`, [id])
    }
}