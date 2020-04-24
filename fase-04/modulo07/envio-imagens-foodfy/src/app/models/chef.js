const db = require('../../config/db')
const fs = require('fs')

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
    find(id) {
        return db.query(`
        SELECT * 
        FROM chefs
        WHERE id = $1`, [id])
    },

    update(data) {
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
    },
    async delete(id) {
        let result = await db.query(`SELECT file_id FROM chefs WHERE id = $1`, [id])
        const fileId = result.rows[0].file_id

        result = await db.query(`SELECT * FROM files WHERE id = $1`, [fileId])
        const file = result.rows[0]
        console.log(file)
        fs.unlinkSync(file.path)

        await db.query(`DELETE FROM chefs WHERE id = $1`, [id])

        return db.query(`
            DELETE FROM files WHERE id = $1
        `, [fileId])

    },
    recipesChef(id) {
        return db.query(`
        SELECT recipes.* FROM recipes WHERE chef_id = $1`, [id])
    },
    files(id) {
        return db.query(`
            SELECT * FROM files WHERE id = $1
        `, [id])
    }
}