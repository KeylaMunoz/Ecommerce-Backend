import { Router } from "express";
import { isUser } from "../middlewares/auth.js";
import { addProduct, deleteCart, getCart, getProductInCart } from "../controllers/cart.controller.js";

const router = Router()

//GET
router.get("/cart", getCart)

//GET
router.get('/cart/:pid', getProductInCart);


//POST
router.post('/cart/:pid', isUser, addProduct);

router.delete('/cart', deleteCart)
export default router;