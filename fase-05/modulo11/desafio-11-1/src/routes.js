const express = require('express')
const routes = express.Router()
const teachers = require('./app/controllers/teachers')
const students = require('./app/controllers/students')

const Validator = require('./app/validators/fields')

routes.get('/', function(req, res) {
    return res.redirect("/teachers")
})

routes.get('/teachers', teachers.index)
routes.get('/teachers/create', teachers.create)
routes.get('/teachers/:id', teachers.show)
routes.get('/teachers/:id/edit', teachers.edit)
routes.post("/teachers", Validator.post, teachers.post)
routes.put("/teachers", Validator.put, teachers.put)
routes.delete("/teachers", teachers.delete)

routes.get('/students', students.index)
routes.get('/students/create', students.create)
routes.get('/students/:id', students.show)
routes.get('/students/:id/edit', students.edit)
routes.post("/students", Validator.post, students.post)
routes.put("/students", Validator.put, students.put)
routes.delete("/students", students.delete)

module.exports = routes