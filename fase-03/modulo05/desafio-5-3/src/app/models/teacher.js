const { date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    all(callback) {
        db.query(`
        SELECT teachers.*, count(students) AS total_students 
        FROM teachers 
        LEFT JOIN students on (teachers.id = students.teacher_id)
        GROUP BY teachers.id
        ORDER BY total_students DESC`, function(err, results) {
            if(err) throw `Database Error! ${err}`

           callback(results.rows)
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO teachers (
                name,
                birth_date,
                education_level,
                class_type,
                subjects_taught,
                created_at,
                avatar_url
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `
        const values = [
            data.name,
            date(data.birth_date).iso,
            data.education_level,
            data.class_type,
            data.subjects_taught,
            date(Date.now()).iso,
            data.avatar_url
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        db.query(`
        SELECT * 
        FROM teachers 
        WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database Error ${err}`

            callback(results.rows[0])
        })
    },
    findBy(filter, callback) {
        db.query(`
        SELECT teachers.*, count(students) AS total_students 
        FROM teachers 
        LEFT JOIN students on (students.teacher_id = teachers.id)
        WHERE teachers.name ILIKE '%${filter}%'
        OR teachers.subjects_taught ILIKE '%${filter}%'
        GROUP BY teachers.id
        ORDER BY total_students DESC`, function(err, results) {
            if(err) throw `Database Error! ${err}`

           callback(results.rows)
        })
    },
    update(data, callback) {
        const query = `
            UPDATE teachers SET
            name=($1),
            birth_date=($2),
            education_level=($3),
            class_type=($4),
            subjects_taught=($5)
            WHERE id = $6
        `

        const values = [
            data.name,
            date(data.birth_date).iso,
            data.education_level,
            data.class_type,
            data.subjects_taught,
            data.avatar_url,
            data.id,
        ]

        db.query(query, values, function(err, results) {
            if(err)  throw `Database Error! ${err}`

            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM teachers WHERE id = $1`, [id], function(err) {
            if(err) throw `Database Error! ${err}`
        })
    }
}