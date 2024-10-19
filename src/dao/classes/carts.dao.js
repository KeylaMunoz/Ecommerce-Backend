import cartModel from "../models/cart.model.js";

export default class Cart {

    getCartWithProducts = async () => {
        try {
            let cart = await cartModel.findOne().populate('products.product').exec();
            return cart
        } catch (error) {
            console.error("Error al obtener el carrito", error);
        }        
    }

    saveCart = async (cart) => {
        try {   
            let cartSave = await cart.save();
            return cartSave
        } catch (error) {
            console.error("Error al guardar el carrito", error);
        }
    };

    findCart = async () => {
        try {
            let cart = await cartModel.findOne()
            if (!cart) {
                console.error("Carrito no encontrado");
            }
            return cart
        } catch (error) {
            console.error("Error al buscar el carrito", error);
        }
    }

    deleteCart = async () => {
        try {
            const result = await cartModel.deleteOne({});
            return result
                
        } catch (error) {
            console.error("Error al eliminar el carrito", error);
        }       
    }
}


