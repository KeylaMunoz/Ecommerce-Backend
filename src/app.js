import express from "express"
import handlebars from 'express-handlebars'
import mongoose from "mongoose"
import { Server } from "socket.io"
import {__dirname} from "./utils.js"
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'
import productsRouter from './routes/products.router.js'
import productsModel from "./models/product.model.js"
import cartModel from "./models/cart.model.js"


const app = express()
const PORT = 8080

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))

 
//handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

//rutas
app.use("/api", productsRouter)
app.use("/api", cartRouter)
app.use("/", viewsRouter)


mongoose.connect("mongodb+srv://keylamunoz:12345@cluster0.bsigyng.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log("conectado a la base")
})
.catch(error => {
    console.log("error", error)
})
 

//socket
const httpServer = app.listen( PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})
const socketServer = new Server(httpServer)

socketServer.on('connection', async (socketServer) => {
    console.log(`Nuevo cliente conectado`)

    /* socketServer.on("productForm" , async (data) => {
        try {
            data.status = true;

            const newProduct = new productsModel(data);
            await newProduct.save();

            let productsSave = await productsModel.find()

            socketServer.emit("products", productsSave)

        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    }); */

//agregar productos al carrito
    socketServer.on("addToCart", async (productId) => {
        try {
            let cart = await cartModel.findOne();
            if (!cart) {
                cart = new cartModel();
            }
            
            const product = await productsModel.findById(productId);
            
            const existingProduct = cart.products.find(p => p.product.toString() === productId);

            if (existingProduct) {
                if (product.stock > 0) {
                    existingProduct.quantity += 1;
                    product.stock -= 1;
                    await cart.save();
                    await product.save();
                    console.log("Cantidad del producto actualizada en el carrito");
                } else {
                    console.log('Stock insuficiente');
                    return
                }
            } else {
                cart.products.push({ product: productId, quantity: 1 });
                product.stock -= 1;
                await cart.save();
                await product.save();
                console.log("Producto agregado al carrito correctamente");
            }

        } catch (error) {
            console.error("Error al agregar el producto al carrito", error);
        }
    })

//eliminar productos del carrito
    socketServer.on("deleteProduct", async (productId) => {

        let cart = await cartModel.findOne();

        const product = await productsModel.findById(productId);

        const existingProduct = cart.products.find(p => p.product.toString() === productId);

        if (existingProduct.quantity > 1) {
            existingProduct.quantity -= 1;
        } else {
            cart.products = cart.products.filter(p => p.product.toString() !== productId);
        }
        
        product.stock += 1;

        await cart.save();

        await product.save();
        
        console.log("producto eliminado y cantidad actualizada");
          
    })
})

 
