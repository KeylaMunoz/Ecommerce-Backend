import express from 'express'
import { readJsonFile } from '../utils.js';
const router = express.Router();

//ejemplo para mostrar por pantalla
router.get("/", async (req, res) => {
    try {
        const productsSave = await readJsonFile('productos.json');
        res.render('home', productsSave);
    } catch (err) {
        res.status(500).json({ error: 'No se pueden cargar los productos', err });
    }
    
})

router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render('realTimeProducts');    
    } catch (err) {
        res.status(500).json({ error: 'No se pueden cargar los productos' });
    }
    
})


export default router;