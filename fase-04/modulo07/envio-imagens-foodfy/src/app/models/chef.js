const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    all(callback) {
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
    create({name, file_id}) {
        const query = `
            INSERT INTO chefs (
                name,
                file_id
            ) VALUES ($1, $2)
            RETURNING id
        `
        const values = [
            name,
            file_id
        ]

        return db.query(query, values)
    },
    find(id, callback) {
        db.query(`
        SELECT * 
        FROM chefs
        WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database Error ${err}`

            callback(results.rows[0])
        })
    },

    update(data, callback) {
        const query = `
            UPDATE chefs SET
            name=($1),
            avatar_url=($2)
            WHERE id = $3
        `

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err)  throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id) {
        db.query(`DELETE FROM chefs WHERE id = $1`, [id], function(err) {
            if(err) throw `Database Error! ${err}`
        })
    },
    chefRecipes(callback) {
        db.query(`
        SELECT * FROM recipes`, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    chefHasRecipes(id, callback) {
        db.query(`
        SELECT chefs.*, count(recipes)
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = ${id}
        GROUP BY chefs.id`, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    }
}