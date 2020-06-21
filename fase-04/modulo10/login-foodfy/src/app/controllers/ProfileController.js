const User = require('../models/User')

module.exports = {
    async index(req, res) {
        const { user } = req
        
        return res.render("admin/profile/index", { user })
    },
    async put(req, res) {
        const { user } = req

        try {
            await User.update(user.id, {
                ...req.body
            })

            let results = await User.all()
            const users = results.rows
            
            return res.render("admin/users/index", {
                users: users,
                success: "Account updated with success!"
            })
        }catch(err) {
            console.error(err)
            return res.render("admin/profile/index", {
                user: user,
                error: "Something went wrong!"
            })
        }
    }
}