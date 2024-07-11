const express = require ("express")
const router = express.Router()

const carts = []

 router.get('/carts', (req, res) => {
     const newCart = req.body
     products.push(newCart)
     res.json({carts})
})



module.exports = router