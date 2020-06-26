const db = require('../../config/db')

module.exports = {
    all() {
        return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes 
        FROM chefs 
        LEFT JOIN recipes on (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
        ORDER BY total_recipes DESC`)
    },
    create({name, file_id}) {
        try{
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
        }catch(err) {
            console.error(err)
        }
    },
    find(id) {
        return db.query(`
        SELECT chefs.* , files.path AS file_src, files.id AS file_id
        FROM chefs
        LEFT JOIN files ON (chefs.file_id = files.id)
        WHERE chefs.id = $1`, [id])
    },

    update(data) {
        try{
            const query = `
                UPDATE chefs SET
                    name=($1),
                    file_id=($2)
                WHERE id = $3
            `

            const values = [
                data.name,
                data.file_id,
                data.id
            ]

            return db.query(query, values)
        }catch(err) {
            console.error(err)
        }
    },
     async delete(id) {
        try{
            let result = await db.query(`SELECT file_id FROM chefs WHERE id = $1`, [id])
            const fileId = result.rows[0].file_id
     
            await db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    
            return db.query(`
                DELETE FROM files WHERE id = $1
            `, [fileId])
        }catch(err) {
             console.error(err)
        }
    },
    recipesChef(id) {
        try {
            return db.query(`SELECT id, title FROM recipes WHERE recipes.chef_id = $1`, [id])
        } catch (error) {
            console.log(error)
        }
     
    },
    files(id) {
        return db.query(`
            SELECT * FROM files WHERE id = $1
        `, [id])
    }
}