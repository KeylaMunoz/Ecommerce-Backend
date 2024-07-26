import express from "express"
import handlebars from 'express-handlebars'
import {__dirname, readJsonFile, writeJsonFile} from "./utils.js"
import { Server } from "socket.io"
import cartsRouter from './routes/carts.router.js'
import productsRouter from './routes/products.router.js'
import viewsRouter from './routes/views.router.js'

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
app.use("/api", cartsRouter)
app.use("/api", productsRouter)
app.use("/", viewsRouter)

//socket
const httpServer = app.listen( PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})
const socketServer = new Server(httpServer)

//array de productos
let productsSave = await readJsonFile('productos.json')

socketServer.on('connection', socketServer => {
    //1
    socketServer.on('message', data => {
        console.log(`Nuevo cliente ${data}`)
    })
    
    socketServer.emit("products", productsSave)
    
    //2
    socketServer.on("productForm" , async data => {
        //Gusrdamos productos creados
        data.id = productsSave.length > 0 ? productsSave[productsSave.length - 1].id + 1 : 1
        data.status = true;
        productsSave.push(data)

        await writeJsonFile('productos.json', productsSave);
        //3
        socketServer.emit("products", productsSave)
    })

    //4
    socketServer.on("deleteProduct", async productId => {
        console.log("id recibidos del cliente:", productId);
        productsSave = productsSave.filter(product => product.id !== parseInt(productId));
        
        await writeJsonFile('productos.json', productsSave);
        
        socketServer.emit("products", productsSave);
        
    });
    socketServer.emit("productsA", productsSave);
    console.log("enviando array actualizado"  );

})


export default productsSave