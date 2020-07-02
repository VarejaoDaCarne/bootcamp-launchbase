async function fields(req, res, next) {
    try {
        const keys = Object.keys(req.body)

        for(key of keys) {
           if(req.body[key] == "")  {
               return res.send('Please, fill all fields')
           }
        }
    
        next()
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    fields
}
