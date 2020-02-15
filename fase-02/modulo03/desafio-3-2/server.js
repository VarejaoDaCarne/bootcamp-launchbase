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
            { name: "Javascript", url: "" },
            { name: "Node.js", url: "" },
            { name: "React", url: "" },
            { name: "React Native", url: "" }
        ]
    }
    return res.render("about", { about })
})

server.get("/courses", function(req, res) {
    return res.render("courses", { courses })
})

server.use(function(req, res) {
    res.status(404).render("not-found")
})

server.listen(5000, function() {
    console.log("server is running")
})