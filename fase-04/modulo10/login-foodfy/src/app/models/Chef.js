const db = require('../../config/db')

module.exports = {
    all() {
        try {
            return db.query(`
            SELECT chefs.*, count(recipes) AS total_recipes 
            FROM chefs 
            LEFT JOIN recipes on (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY total_recipes DESC`)
        } catch (error) {
            console.error(error)
        }
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
        SELECT * 
        FROM chefs
        WHERE id = $1`, [id])
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
        return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    },
    recipesChef(id) {
        return db.query(`
        SELECT recipes.* FROM recipes WHERE chef_id = $1 ORDER BY created_at DESC`, [id])
    },
    files(id) {
        return db.query(`
            SELECT * FROM files WHERE id = $1
        `, [id])
    }
}