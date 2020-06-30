const { age, date, graduation } = require('./src/lib/utils')

const faker = require('faker')

const Teacher = require('./src/app/models/Teacher')

async function createTeachers() {
    try {
        const teachers = []

        while(teachers.length < 1) {
            teachers.push({
                name: faker.name.findName(),
                birth_date: date(Math.random() * 30).iso,
                education_level:  graduation('Médio', 'Superior', 'Mestrado'),
                class_type: Math.round(Math.random() * 2),
                subjects_taught: faker.random.word(Math.round(Math.random() * 5)),
                avatar_url: faker.image.imageUrl()
            })
        }
        
 
        console.log(teachers)
        const teachersPromise = teachers.map(teacher => Teacher.create(teacher))
    
        await Promise.all(teachersPromise)
    } catch (error) {
        console.error(error)
    }
}

async function init() {
    await createTeachers()
}

init()