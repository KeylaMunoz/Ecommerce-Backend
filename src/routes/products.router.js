import express from 'express'
import { readJsonFile, writeJsonFile, existsJsonFile } from '../utils.js';
const router = express.Router();


 //GET
router.get('/products', async (req, res) => {

    try {

        const products = await readJsonFile('productos.json')
        let limit = parseInt(req.query.limit) 
    
        if (limit) res.json(products.slice(0, limit))
    
        res.json(products)
        
    } catch (error) {
        
        res.status(404).json({ message: 'Producto no encontradooooo' });
    }
})
 

router.get('/products/:pid', async (req, res) => { 
    const id = parseInt(req.params.pid)

    try {    

        const products = await readJsonFile('productos.json')
        const product = products.find(p => p.id === id)
    
        if (!product) return res.status(404).json({message: "Este producto no existe"})
        
        res.json({product})

    } catch (err) {

        res.status(404).json({ message: "Este producto no existe" })
    };
}); 


// //POST
router.post('/products', async (req, res) => {

    const { title, description, code, price, stock, category } = req.body
    
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: 'Todos los campos son requeridos', error });
    } 

    const status = true;

    try {
        await existsJsonFile('productos.json')

        const products = await readJsonFile('productos.json')
        const newProduct = {
            id: products.length > 0 ? products[products.length - 1].id + 1 : 1, 
            title, 
            description, 
            code, 
            price, 
            status, 
            stock, 
            category
        } 
    
        products.push(newProduct)

        await writeJsonFile('productos.json', products)
        res.status(201).json(newProduct)
        
    } catch (err) {
        console.log('Error:', err);
        res.status(404).json({ message: 'No se puede crear el producto', error: err.message })        
    }
});
 

// //PUT
router.put('/products/:pid', async (req, res) => {

    let id = parseInt(req.params.pid)

    try {

        const products = await readJsonFile ('productos.json')
        const product = products.find(p => p.id === id)
        if (!product) return res.status(404).json({message: "Este producto no existe"})
    
        const { title, description, code, price, stock, category } = req.body
        if (title) product.title = title;
        if (description) product.description = description;
        if (code) product.code = code;
        if (price !== undefined) product.price = price;
        if (stock !== undefined) product.stock = stock; 
        if (category) product.category = category;

        await writeJsonFile('productos.json', products)
        res.json({product})
        
    } catch (err) {
        
        res.status(500).json({ error: 'Internal Server Error' })
    }
             
});

// //DELETE
router.delete('/products/:pid', async (req, res) => {
    
    let pid = parseInt(req.params.pid)

    try {
        const products = await readJsonFile ('productos.json')
        const filteredProducts = products.filter((product) => product.id !== pid)
        
        await writeJsonFile('productos.json', filteredProducts)

        res.json({message:`Producto con id ${pid} eliminado`}) 
        
    } catch (err) {
        console.log('Error:', err);
        res.status(404).json({ message: 'Producto no encontrado' })
    }
})



export default router;