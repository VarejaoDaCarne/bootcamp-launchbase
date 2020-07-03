const Cart = require('../../lib/cart')

const LoadProductService = require('../services/LoadProductService')

module.exports = {
    async index(req, res) {
    try {
        const product = await LoadProductService.load('product', { where: { id: 2 }})

        let { cart } = req.session

        cart = Cart.init(cart).addOne(product)

        return res.render('cart/index', { cart })
    } catch (error) {
        console.error(error)
    }
    }
}