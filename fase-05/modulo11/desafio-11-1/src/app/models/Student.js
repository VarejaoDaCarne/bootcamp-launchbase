const db = require('../../config/db')

const Base = require('./Base')

Base.init({ table: 'students' })

module.exports = {
    ...Base,
    // find(id, callback) {
    //     db.query(`
    //     SELECT students.*, teachers.name AS teacher_name 
    //     FROM students
    //     LEFT JOIN teachers ON (students.teacher_id = teachers.id)
    //     WHERE students.id = $1`, [id], function(err, results) {
    //         if(err) throw `Database Error ${err}`

    //         callback(results.rows[0])
    //     })
    // },
    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) FROM students
            ) AS total`

        if(filter) {
            filterQuery = `
            WHERE students.name ILIKE '%${filter}%'
            OR students.email ILIKE '%${filter}%'
            `

            totalQuery = `(
                SELECT count(*) FROM students
                ${filterQuery}
            ) AS total`
        }

        query = `
        SELECT students.*, ${totalQuery}
        FROM students
        ${filterQuery}
        LIMIT $1 OFFSET $2 
        `

        db.query(query, [limit, offset], function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    }
}