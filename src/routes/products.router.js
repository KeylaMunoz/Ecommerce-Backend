import { Router } from "express";
import { isAdmin }  from '../middlewares/auth.js'; 
import { createProduct, deleteProduct, getProduct, loadingProducts, updateProduct } from "../controllers/products.controller.js";

const router = Router()

//endpoint
router.get('/products', loadingProducts, (req, res) => {
    res.send(res.locals.result); 
});

//GET
router.get('/products/:pid', getProduct);

//POST
router.post("/products", isAdmin, createProduct);

//PUT
router.put('/products/:pid', isAdmin, updateProduct);

//DELETE
router.delete('/products/:pid', isAdmin, deleteProduct);



export default router;