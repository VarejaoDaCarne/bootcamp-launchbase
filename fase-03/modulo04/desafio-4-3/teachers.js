const fs = require('fs')
const data = require('./data.json')
const { age, date } = require('./utils')

exports.show = function(req, res) {
    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher) {
        return id == teacher.id
    })

    if(!foundTeacher) return res.send("Teacher not found")

    const teacher = {
        ...foundTeacher,
        age: age(foundTeacher.birth),
        occupations: foundTeacher.occupations.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundTeacher.created_at),
    }
    return res.render("teachers/show", { teacher: teacher })
}

exports.post = function(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
       if(req.body[key] == "")  {
           return res.send('Please, fill all fields')
       }
    }

    let {avatar_url, name, birth, graduation, type, occupations} = req.body

    req.body.birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.teachers.length + 1)

    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        graduation,
        type,
        occupations,
        created_at
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write file error")

        return res.redirect("/teachers")
    })

    // return res.send(req.body)
}

exports.edit = function(req, res) {
    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher) {
        return id == teacher.id
    })

    if(!foundTeacher) return res.send("Teacher not found")

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth),
    }

    return res.render('teachers/edit', { teacher }) 
}