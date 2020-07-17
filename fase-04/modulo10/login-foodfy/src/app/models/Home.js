const db = require('../../config/db')

module.exports = {
    async paginate(params) {
        try {
            const { filter, limit, offset } = params

            let query = "",
                filterQuery = `WHERE`
    
            filterQuery = `
                ${filterQuery}
                recipes.title ILIKE '%${filter}%'
            `
    
            totalQuery = `(
                SELECT count(*) FROM recipes
                ${filterQuery}
            ) AS total`
    
            query = `
                SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
                FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                ${filterQuery}
                ORDER BY updated_at DESC 
                LIMIT $1 OFFSET $2
            `
            
            return db.query(query, [limit, offset])
        } catch (error) {
            console.error(error)
        }
    }
}