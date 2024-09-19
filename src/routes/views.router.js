import express from 'express'
import { getProducts } from '../utils.js';
import cartModel from '../models/cart.model.js';
import productsModel from '../models/product.model.js';
import {isAuthenticated, isNotAuthenticated} from '../middleware/auth.js'

const router = express.Router();

 router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login')
})

router.get('/register', isNotAuthenticated, (req, res) => {
     res.render('register')
} )

router.get('/profile', isAuthenticated, (req, res) => {
    res.render("profile", {user: req.session.user})
} ) 


router.get('/', async (req, res) => {
try {

    const result = await getProducts(req.query);
    
    res.render('home', {
        payload: result.docs,
        totalPages: result.totalPages,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink = result.hasPrevPage ? `http://localhost:8080/?page=${result.prevPage}` : null,
        nextLink: result.nextLink = result.hasNextPage ? `http://localhost:8080/?page=${result.nextPage}` : null,
        isValid: result.docs.length > 0
    });
    console.log(result)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'No se pueden cargar los productos por categoria', err });
    }

}) 

router.get("/cart", async (req, res) => {
    try {
          const cart = await cartModel.findOne();

          if (!cart) {
              return res.render('cart', { products: [], total: 0 });
          }
  
          const productIds = cart.products.map(p => p.product);
  
          const products = await productsModel.find({ '_id': { $in: productIds } });
  
          const productsDetails = products.map(product => {
              const cartItem = cart.products.find(p => p.product.toString() === product._id.toString());
              const totalPrice = product.price * cartItem.quantity;

              return {
                  ...product.toObject(),
                  quantity: cartItem.quantity,
                  totalPrice: totalPrice
              };
          });
            
        const total = productsDetails.reduce((acc, product) => acc + (product.price * product.quantity), 0);
  
          res.render('cart', { products: productsDetails, total });

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'No se pueden cargar los productos' });
    }

})




export default router;