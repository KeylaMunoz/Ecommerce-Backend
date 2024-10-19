import express from 'express'
import { renderCart } from '../controllers/cart.controller.js';
import { loadingProducts } from '../controllers/products.controller.js';
import { currentUser } from '../controllers/session.controller.js';
import { isNotAuthenticated} from '../middlewares/auth.js'

const router = express.Router();

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login')
})

router.get('/register', isNotAuthenticated, (req, res) => {
     res.render('register')
} )
 
router.get('/', loadingProducts, (req, res) => {
    const user = req.session.user;  
    const result = res.locals.result;  
    res.render('home', { 
        ...result,   
        user
    });
}) 

router.get('/cart', renderCart, (req, res) => {
    res.render('cart', res.locals.products);
})

router.get('/current', currentUser, (req, res) => {
    res.render('current', res.locals.products)
});

export default router;