const Base = require('../models/Base')

Base.init({ table: 'users' })

module.exports = {
    ...Base
}