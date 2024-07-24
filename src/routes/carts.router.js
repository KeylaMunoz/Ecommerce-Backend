import express from 'express'
import { readJsonFile, writeJsonFile, existsJsonFile } from '../utils.js';
const router = express.Router();


 //POST raiz
router.post('/carts', async (req, res) => {

    await existsJsonFile('carrito.json')
    const {products} = req.body;
    
    if (!products) {        
        return res.status(400).json({ error: 'El arreglo Products es requerido' });
    }
    try {

        const carts = await readJsonFile('carrito.json');
        const id = carts.length + 1;
        carts.push({ id, products });

        await writeJsonFile('carrito.json', carts);
        res.json({ id, products });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
 
///GET
router.get('/carts/:cid', async (req, res) =>{

    const id = parseInt(req.params.cid)

    try {

        const carts = await readJsonFile ('carrito.json')
        const cart = carts.find(c => c.id === id)
        
        if (!cart) return res.status(404).json({message: "El carrito con el ID proporcionado no existe"})
        
    res.json(cart);

    }catch (err) {

        res.status(500).json({ message: err.message })
    }
    
    const carts = await readJsonFile ('carrito.json')
      
});

 
 //POST 2
router.post('/:cid/product/:pid', async (req, res) => {
    await existsJsonFile('carrito.json')

    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const addProduct = {
        product: productId,
        quantity: 1
    }

    try {       
        const carts = await readJsonFile('carrito.json')
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
     
        if (cartIndex !== -1) {
     
            const cart = carts[cartIndex]
            const productIndex = cart.products.findIndex(p => p.product === productId);
     
            if (productIndex !== -1) {
                carts[cartIndex].products[productIndex].quantity += 1;
            } else {
                carts[cartIndex].products.push(addProduct);
            } 

            await writeJsonFile('carrito.json',carts)
            res.status(200).json({ message: 'Producto agregado con exito' });

        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }          
    } catch (err) {
        res.status(404).json({ message: err.message  })
    }         
    
});
   
 export default router;