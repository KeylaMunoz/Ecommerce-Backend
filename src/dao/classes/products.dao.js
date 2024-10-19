import productsModel from "../models/product.model.js";

export default class Product {
    

    getProductById = async (id) => {
        try {
            let product = await productsModel.findById(id)
            return product
            
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            return null             
        }       
    }

    getProductByIds = async (ids) => {
        try {
            const products = await productsModel.find({ '_id': { $in: ids } });
            return products;
        } catch (error) {
            console.error("Error al obtener los productos:", error);
        }
    };

    saveProduct = async ({title, description, code, price, stock, category, image, status}) => {
        try {
            let newProduct = await productsModel.create({title, description, code, price, stock, category, image, status})
            return newProduct
        } catch (error) {
            console.error("Error al guardar el producto:", error);
        }
    }           

    updateProduct = async (id, updatedData) => {
        try {
            let product = await productsModel.findById(id);
        
            if (!product) return null;
        
            Object.keys(updatedData).forEach(key => {
                if (updatedData[key] !== undefined) {
                product[key] = updatedData[key];
                }
            });
        
            let updatedProduct = await product.save();
        
            return updatedProduct;
    
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    }

    deleteProduct = async (id) => {       
        try {
            let productDeleted = await productsModel.deleteOne({ _id: id });
            return productDeleted
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        } 
    }

    paginate = async (query, options) => {
        try {
            const result = await productsModel.paginate(query, options);
            return result
        } catch (error) {
            console.error("No se puede cargar paginate", error);
            
        }
        
    }

}

    


