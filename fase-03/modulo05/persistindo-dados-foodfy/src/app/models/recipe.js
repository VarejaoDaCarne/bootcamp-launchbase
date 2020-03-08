const db = require('../../config/db')

module.exports = {
    all(callback) {
        db.query(`
        SELECT * 
        FROM recipes
        ORDER BY name ASC`, function(err, results) {
            if(err) throw `Database Error! ${err}`

           callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO recipes (
                chef_id
                image,
                title,
                ingredients[],
                preparation[],
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `
        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(data.created_at).iso
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id], function(err, results) {
            if(err) throw `Database Error ${err}`

            callback(results.rows[0])
        })
    },
    update(data, callback) {
        const query = `
            UPDATE recipes SET
                chef_id=($1),
                image=($2)
                title=($3),
                ingredients[]=($4),
                preparation=($5),
                information=($6),
                created_at=($7)
            WHERE id = $8
        `

        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(data.created_at).iso,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err)  throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err) {
            if(err) throw `Database Error! ${err}`
        })
    },
    chefsSelectOptions(callback) {
        db.query(`SELECT name, id FROM chefs`, function(err, results) {
            if(err) throw `Database error!`

            callback(results.rows)
        })
    },
    // paginate(params) {
    //     const { filter, limit, offset, callback } = params

    //     let query = "",
    //         filterQuery = "",
    //         totalQuery = `(
    //             SELECT count(*) FROM recipes
    //         ) AS total`

    //     if(filter) {
    //         filterQuery = `
    //         WHERE recipes.name ILIKE '%${filter}%'
    //         OR recipes.email ILIKE '%${filter}%'
    //         `

    //         totalQuery = `(
    //             SELECT count(*) FROM recipes
    //             ${filterQuery}
    //         ) AS total`
    //     }

    //     query = `
    //     SELECT recipes.*, ${totalQuery}
    //     FROM recipes
    //     ${filterQuery}
    //     LIMIT $1 OFFSET $2 
    //     `

    //     db.query(query, [limit, offset], function(err, results) {
    //         if(err) throw `Database Error! ${err}`

    //         callback(results.rows)
    //     })
    // }
}