import { Router } from "express";
import cartModel from "../models/cart.model.js";
import productsModel from "../models/product.model.js";

const router = Router()

//GET
router.get("/cart", async (req, res) =>{

    try {
        let cart = await cartModel.findOne().populate('products.product').exec();

        let limit = parseInt(req.query.limit);
        
        if (limit) {
            cart.products = cart.products.slice(0, limit);
        }

        res.send({ result: "success", payload: cart.products }); 


    } catch (error) {
        console.error(error) 
    }
})

//GET
router.get('/cart/:pid', async (req, res) =>{

    let id = req.params.pid

    try {

        let cart = await cartModel.findOne()

        let product = cart.products.find(p => p.product.toString() === id)
         
        if (product) {
            res.send({ result: "producto encontrado", payload: product })
        } else {
            res.status(404).json({message: "El producto con el ID proporcionado no existe"})
        }
        
    }catch (err) {

        console.error(err);
        res.status(500).json({ message: "Error al buscar el producto en el carrito", error: err.message })
    }  
});


//POST
router.post('/cart/:pid', async (req, res) => {

    let { pid } = req.params;

    try {

        let cart = await cartModel.findOne();

        if (!cart) {
            cart = new cartModel();
        }

        const productCart = cart.products.find(p => p.product && p.product.toString() === pid);

        if (productCart) {

            productCart.quantity += 1; 

        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();

        const product = await productsModel.findById(pid);
        if (product) {
            if (product.stock > 0) {
                product.stock -= 1;
                await product.save();
            } else {
                return res.status(400).json({ message: 'Stock insuficiente' });
            }
        } else {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.redirect('/c');
        console.log(productCart);
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: err.message  })
    }         
    
});

router.delete('/cart', async (req, res) => {

    try {
        const result = await cartModel.deleteOne({});

        if (result.deletedCount > 0) {
            res.json({ message: `Carrito eliminado` });
        } else {
            res.status(404).json({ message: `No se encontró ningún carrito para eliminar` });
        }
    } catch (err) {
        console.log('Error:', err);
        res.status(500).json({ message: 'Error al eliminar el carrito', err });
    }
});
export default router;