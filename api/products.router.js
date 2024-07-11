const express = require ("express")
const router = express.Router()

const products = []

//GET
 router.get('/products', (req, res) => {
     const newProduct = req.body
     products.push(newProduct)
     res.json({products})
})

router.get('/products/:pid', (req, res) => {
    let pid = parseInt(req.params.pid)
    let product = products.find(p => p.id === pid)
    if (!product) return res.status(404).json({message: "Este producto no existeeeee"})
        res.json({product})
}) 

router.get('/products', (req, res) => {
    let limit = parseInt(req.query.limit)
    let limitedProducts = [...products]

    if (!isNaN(limit) && limit > 0 ) {
        limitedProducts = limitedProducts.slice(0, limit)
    }   
    res.json(limitedProducts)
}) 

//POST
router.post('/products', (req, res) => {
    const { title, description, code, price, stock, category } = req.body
    const status = true;

    const newProduct = {id: products.length + 1, title, description, code, price, status, stock, category}
    products.push(newProduct)
    res.status(201).json(newProduct)
})

//PUT
router.put('/products/:pid', (req, res) => {
    let pid = parseInt(req.params.pid)
    let product = products.find(p => p.id === pid)

    if (product){
        const { title, description, code, price, stock, category } = req.body;
        product.title = title
        product.description = description
        product.code = code
        product.price = price
        product.stock = stock
        product.category = category
        res.json({product})
        
    } else {
        res.status(404).json({message: "Producto no existente"})
    }
})



module.exports = router