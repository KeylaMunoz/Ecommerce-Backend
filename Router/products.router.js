const express = require ('express')
const fs = require ('fs')
const router = express.Router()

// if (!fs.existsSync('products.json')) {
//     fs.writeFileSync('products.json', JSON.stringify([]), 'utf8');
// }

//GET
 router.get('/products', (req, res) => {
    
    fs.readFile('productos.json', 'utf8', (err, data) => {

        if (err)  return res.status(404).json({ message: 'Producto no encontrado' });
        
        const products = JSON.parse(data)
        const limit = req.query.limit

        if (limit) res.json(products.slice(0, limit))

        res.json(products)
    })
 })


router.get('/products/:pid', (req, res) => {

    const id = parseInt(req.params.pid)

    fs.readFile('productos.json', 'utf8', (err, data) => {

        if (err) return res.status(404).json({ err })
        
        const products = JSON.parse(data)
        const product = products.find(p => p.id === id)

        if (!product) return res.status(404).json({message: "Este producto no existeeeee"})
        
        res.json({product})
    })
}) 


//POST
router.post('/products', (req, res) => {

    const { title, description, code, price, stock, category } = req.body
    const status = true;
    
    fs.readFile('productos.json', 'utf8', (err, data) => {

        if (err) return res.status(404).json({ message: 'No se puede crear el producto' })
        
        const products = JSON.parse(data)
        const newProduct = {id: products.length + 1, title, description, code, price, status, stock, category}
        
        if (!title || !description || !code || price === undefined || stock === undefined || !category) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        products.push(newProduct)

        fs.writeFile('productos.json', JSON.stringify(products, null, 2), err => {
            
            if (err) return res.status(400).json({ message: 'No se puede crearrrr' })
                
            res.status(201).json(newProduct)
        });
    });
});


//PUT
router.put('/products/:pid', (req, res) => {

    let id = parseInt(req.params.pid)
    
    //leemos archivo
    fs.readFile('productos.json', 'utf8', (err, data) => {
        
        if (err) return res.status(500).json({ error: 'Internal Server Error' })
        
        const products = JSON.parse(data)
        const product = products.find(p => p.id === id)

        if (!product) return res.status(404).json({message: "Este producto no existeeeee"})

        const { title, description, code, price, stock, category } = req.body
        if (title) product.title = title;
        if (description) product.description = description;
        if (code) product.code = code;
        if (price !== undefined) product.price = price;
        if (stock !== undefined) product.stock = stock;
        if (category) product.category = category;
        
        //actualizamos campos
        fs.writeFile('productos.json', JSON.stringify(products, null, 2), err => {
            
            if (err) return res.status(400).json({ message: 'No se puede crearrrr' })
            
            res.json({product})
        });
    });         
});

//DELETE
router.delete('/products/:pid', (req, res) => {

    let pid = parseInt(req.params.pid)

    products = products.filter((product) => product.id !== pid)

    res.json({message:`Producto con id ${pid} eliminado`}) 
})



module.exports = router