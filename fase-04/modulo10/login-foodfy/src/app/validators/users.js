const User = require('../models/User')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for(key of keys) {
       if(body[key] == "")  {
            return {
                user: body,
                error: 'Please, fill all fields'
            }
       }
    }
}

async function post(req, res, next) {
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields) {
        return res.render("admin/user/register", fillAllFields)
    }
    
    let { email } = req.body

    const user = await User.findOne({ 
        where: { email }
    })

    if(user) return res.render('admin/users/register', {
        user: req.body,
        error: 'User already registered!'
    })

    next()
}

async function show(req, res, next) {
    const { id } = req.params

    const user = await User.findOne({ where: {id}} )

    if(!user) return res.render("admin/user/index", {
        error: "User not find"
    })

    req.user = user

    next()
}

async function update(req, res, next) {
    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields) {
        return res.render("admin/users/show", fillAllFields)
    }

    const { id } = req.body

    const user = await User.findOne({ where: {id} })

    req.user = user

    next()
}

module.exports = {  
    post,
    show,
    update
}