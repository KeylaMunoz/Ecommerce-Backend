import Cart from "../dao/classes/carts.dao.js"
import Product from "../dao/classes/products.dao.js";

const cartService = new Cart()
const productService = new Product()

export const getCart = async (req, res) => {
    try {
        let cart = await cartService.getCartWithProducts()

        let limit = parseInt(req.query.limit);
        if (limit) {
            cart.products = cart.products.slice(0, limit);
        }

        res.send({ result: "success", payload: cart.products });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se puede cargar el carrito', error });
    }
};

export const getProductInCart = async (req, res) => {

    let id = req.params.pid

    try {

        let cart = await cartService.findCart()

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
    
}

export const addProduct = async (req, res) => {
    let { id } = req.body;

    try {

        let cart = await cartService.findCart();

        const productCart = cart.products.find(p => p.product && p.product.toString() === id);

        if (productCart) {

            productCart.quantity += 1; 

        } else {
            cart.products.push({ product: id, quantity: 1 });
        }

        await cartService.saveCart(cart);

        const product = await productService.getProductById(id);
        if (product) {

            if (product.stock > 0) {
                product.stock -= 1;
                // await product.save();
                await productService.updateProduct(product._id, { stock: product.stock }); 
            } else {
                return res.status(400).json({ message: 'Stock insuficiente' });
            }
        } else {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto agregado al carrito', cart });
        // res.redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se puede agregar el producto al carrito', error })
    }         
    
}

export const deleteCart = async (req, res) => {
    try {
        const result = await cartService.deleteCart()
        if (result.deletedCount > 0) {
            res.json({ message: 'Carrito eliminado' });
        } else {
            res.status(404).json({ message: 'No se encontró ningún carrito para eliminar' });
        }
    } catch (err) {
        console.log('Error:', err);
        res.status(500).json({ message: 'Error al eliminar el carrito', err });
    }
}

export const renderCart = async (req, res, next) => {
    try {
        const cart = await cartService.findCart();
        if (!cart) {
            return res.render('cart', { products: [], total: 0 });
        }

        const productIds = cart.products.map(p => p.product);
        const products = await productService.getProductByIds(productIds);

        const productsDetails = products.map(product => {
            const cartItem = cart.products.find(p => p.product.toString() === product._id.toString());
            return {
                ...product.toObject(),
                quantity: cartItem.quantity,
                totalPrice: product.price * cartItem.quantity,
            };
        });

        const total = productsDetails.reduce((acc, product) => acc + (product.price * product.quantity), 0);
        
        res.locals.products = { products: productsDetails, total };

        next()
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'No se pueden cargar los productos' });
    }
};