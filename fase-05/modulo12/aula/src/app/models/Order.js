const Base = require('../models/Base')

Base.init( { table: 'orders' })

module.exports = {
    ...Base
}