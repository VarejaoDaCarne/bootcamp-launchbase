const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    all() {
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`)
    },
    create(data) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `
        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information
        ]

       return db.query(query, values)
    },
    find(id) {
       return db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1`, [id])
    },
    update(data) {
        const query = `
            UPDATE recipes SET
                chef_id=($1),
                title=($2),
                ingredients=($3),
                preparation=($4),
                information=($5)
            WHERE id = $6
        `

        const values = [
            data.chef,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        return db.query(query, values)
    },
    async delete(id) {
        let result = await db.query(`SELECT * FROM recipe_files WHERE recipe_id = $1`, [id])
        const files = result.rows

        // let filesId = []

        // for(let i in files) {
        //     let getId = files[i].file_id
        //     filesId.push(getId)
        // }
        // let results = ""
        // let file = []
        // for(let fileId in filesId) {
            results = await db.query(`SELECT path FROM files WHERE id = $1`, [fileId])

            file.push(results.rows)
            
        // }
        // console.log(file)
        fs.unlinkSync(results.path)
     


        await db.query(`
            DELETE FROM recipe_files WHERE recipe_id = $1
        `,[id])

        for(let fileId in filesId) {
            await db.query(`
            DELETE FROM files WHERE id = $1
        `, [fileId])
        }

    return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
    },
   chefsSelectOptions() {
        return db.query(`SELECT name, id FROM chefs`)
    },
    files(id) {
        return db.query(`
        SELECT files.*, recipe_id, file_id
        FROM files
        LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
        WHERE recipe_id = $1`, [id])
    }
}