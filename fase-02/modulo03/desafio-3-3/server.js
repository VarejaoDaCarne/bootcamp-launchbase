const express = require('express')
const nunjucks = require('nunjucks')
const courses = require('./data')

const server = express()

server.use(express.static('public'))

server.set("view engine", "njk")

nunjucks.configure("views", {
    express: server,
})

server.get("/", function(req, res) {
    const about = {
        company_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRDBed9se7UE25MhFOY8N2dMFbPEoILsNmBp0ff3OiP4dgTIstK",
        company: "Rocketseat",
        description: "As melhores tecnologias em programação, direto ao ponto e do jeito certo.",
        technologies: [
            { name: "Javascript", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/480px-Unofficial_JavaScript_logo_2.svg.png" },
            { name: "Node.js", url: "https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/full/nodejslogo.png" },
            { name: "React", url: "https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png" },
        ]
    }
    return res.render("about", { about })
})

server.get("/courses", function(req, res) {
    return res.render("courses", { courses })
})

server.get("/courses/:id", function(req, res) {
    const id = req.params.id

    const course = courses.find(function(course) {
        return course.id == id
    })

    if (!course) {
        return res.send("Course not found")
    }
    
    return res.render(`${id}`)
  })

server.use(function(req, res) {
    res.status(404).render("not-found")
})

server.listen(5000, function() {
    console.log("server is running")
})