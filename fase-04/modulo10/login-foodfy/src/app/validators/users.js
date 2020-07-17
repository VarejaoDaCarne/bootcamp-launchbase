const User = require('../models/User')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for(key of keys) {
       if(body[key] == "")  {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos'
            }
       }
    }
}

async function post(req, res, next) {
    try {
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
            error: 'Usuário já cadastrado'
        })
    
        next()
    } catch (error) {
        console.error(error)
        return res.render('admin/users/register', {
            user: req.body,
            error: 'Algo deu errado'
        })
    }
}

async function show(req, res, next) {
    try {
        const { id } = req.params

        const user = await User.findOne({ where: {id}} )
    
        if(!user) return res.render("admin/user/index", {
            error: "Usuário não encontrado"
        })
    
        req.user = user
    
        next()
    } catch (error) {
        console.error(error)
        return res.render("admin/user/index", {
            error: "Algo deu errado"
        })
    }
}

async function update(req, res, next) {
    try {
        const { id } = req.body

        const user = await User.findOne({ where: {id} })
    
        const fillAllFields = checkAllFields(req.body)
        if(fillAllFields) {
            if(!user.is_admin){
                return res.render("admin/profile/index", fillAllFields)
            }else {
                return res.render("admin/users/show", fillAllFields)
            }
        }
    
        req.user = user
    
        next()
    } catch (error) {
        console.error(error)
        return res.render("admin/profile/index", {
            user: req.body,
            error: "Algo deu errado"
        })
    }
}

async function remove(req, res, next) {
    try {
        const { id } = req.body

        const user = await User.findOne({ where: {id} })
     
        if(user.is_admin && user.id == req.session.userId)
            return res.render("admin/users/show", {
                user: user,
                error: "Você não pode deletar sua própria conta"
            })
    
        next()
    } catch (error) {
        console.error(error)
    }
}

module.exports = {  
    post,
    show,
    update,
    remove
}