import express from "express"
import handlebars from 'express-handlebars'
import cookieParser from "cookie-parser"
import { Server } from "socket.io"
import {__dirname} from "./utils.js"
import session from 'express-session'
import nodemailer from 'nodemailer'
import MongoStore from "connect-mongo"
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'
import productsRouter from './routes/products.router.js'
import sessionsRouter from './routes/api/sessions.router.js'
import productsModel from "./dao/models/product.model.js"
import cartModel from "./dao/models/cart.model.js"
import emailRouter from "./routes/email.router.js"
import passport from 'passport'
import config from "./config/config.js"
import db from "./config/database.js"
import { serializeUser, deserializeUser, registerStrategy, loginStrategy } from "./controllers/session.controller.js"


const app = express() 

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongoUrl,
        ttl: 15,
    }),
    secret: "claveSecreta",
    resave: false,
    saveUninitialized: true
})) 

//passport

app.use(passport.initialize())
app.use(passport.session())
registerStrategy();
loginStrategy();
serializeUser();
deserializeUser();



//handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

//rutas
app.use("/api", productsRouter)
app.use("/api", cartRouter)
app.use('/api/sessions', sessionsRouter)
app.use("/", viewsRouter)
app.use("/", emailRouter)
 

//nodemailer
const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: "keyla.keyla.munoz@gmail.com",
        pass: config.mailingPass
    }
})




//socket
const httpServer = app.listen( config.port, () => {
    console.log(`Server runing on poooort ${config.port}`)
})
const socketServer = new Server(httpServer)

socketServer.on('connection', async (socketServer) => {
    console.log(`Nuevo cliente conectado`)

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


