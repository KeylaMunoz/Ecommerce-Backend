import { Router } from "express";
import productsModel from "../models/product.model.js";
import { getProducts } from "../utils.js";

const router = Router()

//endpoint
router.get('/products', async (req, res) => {
    try {
       
        const result = await getProducts(req.query);
    
        res.send({ 
            result: "success", 
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
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

//GET
router.get('/products/:pid', async (req, res) => {

    const id = req.params.pid

    try {

        let product = await productsModel.findById(id)

        if (!product) return res.status(404).json({message: "Este producto no existe"})

        res.send({ result: "Producto encontrado", payload: product })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al buscar el producto", error: err.message })
    };
});

//POST
router.post("/products", async (req, res )=>{
    let { title, description, code, price, stock, category, image } = req.body

    if (!title || !description || !code || !price || !stock || !category || !image) {
        return res.status(400).json({ message: 'Todos los campos son requeridos'});
    }

    let status = true;

let product = await productsModel.create({title, description, code, price, stock, category, image, status})

res.send ({result:"producto agregado", payload: product})
})

//PUT
router.put('/products/:pid', async (req, res) => {

    let id = req.params.pid

    try {

        let productFind = await productsModel.findById(id)

        if (!productFind) return res.status(404).json({message: "Este producto no existe"})

        let { title, description, code, price, stock, category, image } = req.body
        if (title) productFind.title = title;
        if (description) productFind.description = description;
        if (code) productFind.code = code;
        if (price !== undefined) productFind.price = price;
        if (stock !== undefined) productFind.stock = stock;
        if (category) productFind.category = category;
        if (image) productFind.image = image;

        let updatedProduct = await productFind.save();

        res.send({ result: "Producto actualizado", payload: updatedProduct });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', err })
    }

});

//DELETE

router.delete('/products/:pid', async (req, res) => {
    const id = req.params.pid;

    try {
        const result = await productsModel.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ message: `Producto con id ${id} eliminado` });
    } catch (err) {
        console.log('Error:', err);
        res.status(500).json({ message: 'Error al eliminar el producto', err });
    }
});



export default router;