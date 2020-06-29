const { date, year } = require('../../lib/utils')

const Student = require('../models/Student')
const Teacher = require('../models/Teacher')

module.exports = {
    index(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(students) {
                
                const pagination = {
                    total: Math.ceil(students.total / limit),
                    page
                }

                return res.render("students/index", { students, pagination, filter })
            }
        }

        Student.paginate(params)
    },
    async create(req, res) {
        try {
            const options = await Teacher.findAll()

            return res.render("students/create", { teacherOptions: options })
        } catch (error) {
            console.error(error)
        }
    },
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)

            for(key of keys) {
               if(req.body[key] == "")  {
                   return res.send('Please, fill all fields')
               }
            }
    
            let { avatar_url, name, birth, email, school_year, week_hours, teacher_id } = req.body
        
            birth = date(birth).iso

            const student_id = await Student.create({
                avatar_url,
                name,
                birth, 
                email, 
                school_year, 
                week_hours,
                teacher_id
            })
     
            return res.redirect(`/students/${student_id}`)
        } catch (error) {
            console.error(error)
        }
    },
    async show(req, res) {
        try {
            const student = await Student.findOne({ where: { id: req.params.id } })

            if(!student) return res.send("Student not found!")
    
            student.birth = date(student.birth).birthDay
            student.school_year = year(student.school_year)
    
            return res.render("students/show", { student })
        } catch (error) {
            console.error(error)
        }
    },
    async edit(req, res) {
        try {
            const student = await Student.findOne({ where: { id: req.params.id } })

            if(!student) return res.send("Student not found!")

            student.birth = date(student.birth).iso

            const options = await Teacher.findAll()

            return res.render("students/edit", { student, teacherOptions: options })
        } catch (error) {
            console.error(error)
        } 
    },
    put(req, res) {
        const keys = Object.keys(req.body)

        for(key of keys) {
           if(req.body[key] == "")  {
               return res.send('Please, fill all fields')
           }
        }
        //            date(data.birth).iso,
        Student.update(req.body, function() {
            return res.redirect(`/students/${req.body.id}`)
        })
    },
    delete(req, res) {
        Student.delete(req.body.id, function() {
            return res.redirect(`/students`)
        })
    }
}