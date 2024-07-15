const express = require ('express')
const fs = require ('fs')
const router = express.Router()


//POST raiz
router.post('/carts', (req, res) => {

    const {products} = req.body;
    
    if (products) {
        
        fs.readFile('carrito.json', 'utf8', (err, data) => {
            
            if (err) return res.status(404).json({ message: 'No se puede leer el carrito' });
            
            const carts = JSON.parse(data)
            const id = carts.length + 1;
            carts.push({ id, products });
            
            fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), err => {

                if (err) return res.status(404).json({ message: 'No se puede crear el carrito' });

                res.json({ id, products });
            });        
        })
    } else {
        res.status(400).json({ error: 'El arreglo Products es requerido' });
    }
})

//GET
router.get('/carts/:cid', (req, res) =>{

    const id = parseInt(req.params.cid)

    fs.readFile('carrito.json', 'utf8', (err, data) => {

        if (err) return res.status(404).json({ message: 'No se puede leer el carrito' })
        
        const carts = JSON.parse(data)
        const cart = carts.find(c => c.id === id)

        if (!cart) return res.status(404).json({message: "El carrito con el ID proporcionado no existe"})
        
        res.json(cart)
    });
});


//POST 2
router.post('/:cid/product/:pid', (req, res) => {

    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const addProduct = {
        product: productId,
        quantity: 1
    }

    fs.readFile('carrito.json', 'utf8', (err, data) => {

        if (err) return res.status(404).json({ message: 'No se puede leer el carrito' })

        const carts = JSON.parse(data)
        const cartIndex = carts.findIndex(cart => cart.id === cartId);

        if (cartIndex !== -1) {

            const cart = carts[cartIndex]
            const productIndex = cart.products.findIndex(p => p.product === productId);

            if (productIndex !== -1) {
                carts[cartIndex].products[productIndex].quantity += 1;
            } else {
                carts[cartIndex].products.push(addProduct);
            } 


                fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), err => {
                    if (err) return res.status(404).json({ message: 'error server' });

                    res.status(200).json({ message: 'Producto agregado con exito' });
                }) 

        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    });
});


module.exports = router