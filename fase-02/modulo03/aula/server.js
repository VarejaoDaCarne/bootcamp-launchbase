const express = require('express')
const nunjucks = require('nunjucks')
const videos = require('./data')

const server = express()

server.use(express.static('public'))

server.set("view engine", "njk")

nunjucks.configure("views", {
    express: server,
    autoescape: false,
    noCache: true
})

server.get("/", function(req, res) {
    const about = {
        avatar_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQpiVKSfx9AMKN7zGFehnNK1uZoqZOdKyNHSqvK2WntNqc_D-PY",
        name: "Pepega Pepa",
        role: "Instrutor - Rockeseat",
        description: 'Programador full-stack, focado em trazer o melhor ensino para iniciantes em programação. Colaborador da <a href="https://rocketseat.com.br/" target="blank">Rocketseat</a>',
        links: [
            { name: "Github", url: "" },
            { name: "Linkedin", url: "" },
            { name: "Twiter", url: "" }
        ]
    }
    return res.render("about", { about })
})

server.get("/portfolio", function(req, res) {
    return res.render("portfolio", { items: videos })
})

server.get("/video", function(req, res) {
    const id = req.query.id

    const video = videos.find(function(video) {
        return video.id == id
    })

    if (!video) {
        return res.send("Video not found")
    }

    return res.render("video", { item: video })
})

server.listen(5000, function() {
    console.log("server is running")
})
