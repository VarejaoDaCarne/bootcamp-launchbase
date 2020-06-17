const db = require('../../config/db')

module.exports = {
    allRecipes(callback) {
        db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`, function(err, results) {
            if(err) throw `Database Error! ${err}`

           callback(results.rows)
        })
    },
    allChefs(callback) {
        db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes 
        FROM chefs 
        LEFT JOIN recipes on (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        ORDER BY total_recipes DESC`, function(err, results) {
            if(err) throw `Database Error! ${err}`

           callback(results.rows)
        })
    },
    findRecipe(id, callback) {
        db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id], function(err, results) {
            if(err) throw `Database Error ${err}`

            callback(results.rows[0])
        })
    },
    findChef(id, callback) {
        db.query(`
        SELECT * 
        FROM chefs
        WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database Error ${err}`

            callback(results.rows[0])
        })
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
    }
}