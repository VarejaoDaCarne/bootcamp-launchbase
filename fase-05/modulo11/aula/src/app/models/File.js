const Base = require('../models/Base')

Base.init( { table: 'files' })

module.exports = {
    ...Base
}
