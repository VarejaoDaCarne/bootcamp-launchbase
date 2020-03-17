const db = require('../../config/db')

module.exports = {
    allRecipes(callback) {
        db.query(`
        SELECT receipts.*, chefs.name AS chef_name 
        FROM receipts
        LEFT JOIN chefs ON (receipts.chef_id = chefs.id)`, function(err, results) {
            if(err) throw `Database Error! ${err}`

           callback(results.rows)
        })
    },
    allChefs(callback) {
        db.query(`
        SELECT chefs.*, count(receipts) AS total_recipes 
        FROM chefs 
        LEFT JOIN receipts on (chefs.id = receipts.chef_id)
        GROUP BY chefs.id
        ORDER BY total_recipes DESC`, function(err, results) {
            if(err) throw `Database Error! ${err}`

           callback(results.rows)
        })
    },
    findRecipe(id, callback) {
        db.query(`
        SELECT receipts.*, chefs.name AS chef_name 
        FROM receipts
        LEFT JOIN chefs ON (receipts.chef_id = chefs.id)
        WHERE receipts.id = $1`, [id], function(err, results) {
            if(err) throw `Database Error ${err}`

            callback(results.rows[0])
        })
    },
    findBy(filter, callback) {
        db.query(`
        SELECT chefs.*, count(receipts) AS total_recipes 
        FROM chefs 
        LEFT JOIN receipts on (receipts.chef_id = chefs.id)
        WHERE chefs.name ILIKE '%${filter}%'
        GROUP BY chefs.id
        ORDER BY total_recipes DESC`, function(err, results) {
            if(err) throw `Database Error! ${err}`

           callback(results.rows)
        })
    },
    chefRecipes(callback) {
        db.query(`SELECT * FROM receipts`, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    filter(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM receipts
            ) AS total`

        if(filter) {
            filterQuery = `
            WHERE receipts.title ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM receipts
                ${filterQuery}
            ) AS total`
        }

        query = `
        SELECT receipts.*, ${totalQuery}, chefs.name AS chef_name
        FROM receipts
        LEFT JOIN chefs ON (receipts.chef_id = chefs.id)
        ${filterQuery}
        LIMIT $1 OFFSET $2 
        `

        db.query(query, [limit, offset], function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    }
}