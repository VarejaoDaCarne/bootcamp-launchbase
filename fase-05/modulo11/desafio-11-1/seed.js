const { date } = require('./src/lib/utils')

const { teachers: dataTeachers, students: dataStudents } = require('./dataMyTeacher.json')

const Teacher = require('./src/app/models/Teacher')
const Student = require('./src/app/models/Student')

let teachersIds = []

async function createTeachers() {
    try {
        let index = 0

        while(index < dataTeachers.length) {
            let { avatar_url, name, birth_date, education_level, class_type, subjects_taught } = dataTeachers[index]
           
            const teachers = {
                name,
                birth_date,
                education_level,
                class_type,
                subjects_taught,
                avatar_url
            }

            birth_date = date(birth_date).iso

            let teacherId = await Teacher.create(teachers)
            teachersIds.push(teacherId)

            index++
        }
    } catch (error) {
        console.error(error)
    }
}

async function createStudents() {
    try {
        let index = 0

        while(index < dataStudents.length) {
            let { avatar_url, name, birth, email, school_year, week_hours } = dataStudents[index]
           
            const students = {
                avatar_url,
                name,
                birth,
                email,
                school_year,
                week_hours,
                teacher_id: teachersIds[Math.floor(Math.random() * teachersIds.length)],
            }

            birth = date(birth).iso

            await Student.create(students)
            
            index++
        }
    } catch (error) {
        console.error(error)
    }
}

async function init() {
    await createTeachers(),
    await createStudents()
}

init()