const { date, year } = require('../../lib/utils')

const Student = require('../models/Student')
const Teacher = require('../models/Teacher')

module.exports = {
    async index(req, res) {
        try {
            let total = 0,
             { filter, page, limit } = req.query 

            page = page || 1
            limit = limit || 2
            let offset = limit * (page - 1)
            
            const params = { filter, page, limit, offset }

            const students =  await Student.paginate(params)

            if(students.length != 0) {
                total = Math.ceil(students[0].total / limit)
            }

            const pagination = { total, page }

            return res.render("students/index", { students, pagination, filter })
        } catch (error) {
            console.error(error)
        }
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
            let { avatar_url, name, birth, email, school_year, week_hours, teacher } = req.body
        
            birth = date(birth).iso
            
            const student_id = await Student.create({
                avatar_url,
                name,
                birth, 
                email, 
                school_year, 
                week_hours,
                teacher_id: teacher
            })

            return res.render(`parts/save`, { student_id })
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

            const teacher = await Teacher.find(student.teacher_id)

            return res.render("students/show", { student, teacher })
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
    async put(req, res) {
        try {
            req.body.birth = date(req.body.birth).iso

            const student_id = await Student.update(req.body.id, {
                avatar_url: req.body.avatar_url,
                name: req.body.name,
                birth: req.body.birth, 
                email: req.body.email, 
                school_year: req.body.school_year, 
                week_hours: req.body.week_hours,
                teacher_id: req.body.teacher
            })
    
            return res.render(`parts/save`, { student_id })
        } catch (error) {
            console.error(error)
        }    
    },
    async delete(req, res) {
        try {
            await Student.delete(req.body.id)

            return res.render(`parts/remove`)
        } catch (error) {
            console.error(error)
        }
    }
}