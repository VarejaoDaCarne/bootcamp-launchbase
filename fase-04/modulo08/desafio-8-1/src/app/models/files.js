const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create({filename, path}) {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `
        
        const values = [
            filename,
            path
        ]

        return db.query(query, values)
    },
    all() {
        return db.query(`
            SELECT * FROM files 
        `)
    },
    async recipeDelete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]
 
            fs.unlinkSync(file.path)

            await db.query(`
                DELETE FROM recipe_files WHERE file_id = $1
            `, [id])

            return db.query(`
                DELETE FROM files WHERE id = $1
            `,[id])
        }catch(err) {
            console.error(err)
        }
    },
    async chefDelete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]

            fs.unlinkSync(file.path)

            await db.query(`
                DELETE FROM chefs WHERE file_id = $1
            `, [id])
            
            return db.query(`
                DELETE FROM files WHERE id = $1
            `, [id])
        }catch(err) {
            console.error(err)
        }
    }
}