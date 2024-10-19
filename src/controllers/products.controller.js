import Product from "../dao/classes/products.dao.js";
import  ProductDTO  from '../dto/products.dto.js'

const productService = new Product()

export const loadingProducts = async (req, res, next) => {
    try {
        let query = {};
        let sort = {};
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const { category, sort: sortOrder, title } = req.query;

        if (category) { 
            query.category = category; 
        }

        if (title) { 
            query.title = new RegExp(title, 'i'); 
        }

        if (sortOrder) { 
            sort.price = sortOrder === 'asc' ? 1 : -1; 
        }

        const options = {
            limit,
            sort,
            page,
            lean: true 
        };

        const result = await productService.paginate(query, options);

        if (!result || !result.docs) {
            return res.status(500).json({ error: 'Error al cargar los productos paginados' });
        }
        
         res.locals.result = { 
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
        };

        next();
        
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'No se pueden cargar los productos por categoria', err });
    }
}


export const getProduct = async (req, res) => {

    const id = req.params.pid

    try {

        let product = await productService.getProductById(id)

        if (!product) return res.status(404).json({message: "Este producto no existe"})
        
        const productDTO = new ProductDTO(product);

        res.send({ result: "Producto encontrado", payload: productDTO })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al buscar el producto", error: err.message })
    };
};


export const createProduct = async (req, res )=>{
    let { title, description, code, price, stock, category, image } = req.body

    if (!title || !description || !code || !price || !stock || !category || !image) {
        return res.status(400).json({ message: 'Todos los campos son requeridos'});
    }

    let product = await productService.saveProduct({title, description, code, price, stock, category, image, status: true})

    const productDTO = new ProductDTO(product);

    res.send ({result:"producto agregado", payload: productDTO})
}

export const updateProduct = async (req, res) => {

    let id = req.params.pid

    try {

        let productFind = await productService.getProductById(id)

        if (!productFind) return res.status(501).json({message: "Este producto no existe"})

        let { title, description, code, price, stock, category, image } = req.body

        if (title) productFind.title = title;
        if (description) productFind.description = description;
        if (code) productFind.code = code;
        if (price !== undefined) productFind.price = price;
        if (stock !== undefined) productFind.stock = stock;
        if (category) productFind.category = category;
        if (image) productFind.image = image;

        let updatedData = { title, description, code, price, stock, category, image, status: true };


        let updatedProduct = await productService.updateProduct(id, updatedData);

        const updatedProductDTO = new ProductDTO(updatedProduct);

        res.send({ result: "Producto actualizado", payload: updatedProductDTO });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'No se puede actualizar este producto', err })
    }

}

export const deleteProduct = async (req, res) => {
    const id = req.params.pid;

    try {
        const result = await productService.deleteProduct(id);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ message: `Producto con id ${id} eliminado` });
    } catch (err) {
        console.log('Error:', err);
        res.status(500).json({ message: 'Error al eliminar el producto', err });
    }
};
    
    