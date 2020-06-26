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
    async recipeFiles(id) {
        return db.query(`
            SELECT files.*
            FROM files 
            LEFT JOIN recipe_files ON (recipe_files.file_id = files.id)
            WHERE recipe_files.recipe_id = $1 `, [id]
        )
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
            
            return db.query(`
                DELETE FROM files WHERE id = $1
            `, [id])
        }catch(err) {
            console.error(err)
        }
    }
}