const db = require('../../config/db')

module.exports = {
    create({recipe_id,  file_id}) {
        try {
            const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            RETURNING id
        `
        
        const values = [
            recipe_id,
            file_id
        ]

        return db.query(query, values)
        } catch (error) {
            console.error(error)
        }
    },
    all(id) {
        return db.query(`
            SELECT * FROM recipe_files WHERE id = $1
        `, [id])
    },
    async delete(id) {
        return db.query(`DELETE FROM recipe_files WHERE recipe_id, file_id = $1 `, [id])
    }
}