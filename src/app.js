import express from "express"
import handlebars from 'express-handlebars'
import __dirname from "./utils.js"
// import ejemploRouter from './routes/ejemplo.router.js'
import { Server } from "socket.io"
import cartsRouter from './routes/carts.router.js'
import productsRouter from './routes/products.router.js'

const app = express()
const PORT = 8080


app.use(express.json())
app.use(express.urlencoded({extended: true}))


//midlehandlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views') 
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))


// app.use("/", ejemploRouter)
app.use("/api", cartsRouter)
app.use("/api", productsRouter) 


const httpServer = app.listen( PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})
const socketServer = new Server(httpServer)

let messages = []
 
// socketServer.on('connection', socketServer => {
//     console.log('Nuevo cliente')

//     socketServer.on("message", data => {
//         messages.push(data)
//         socketServer.emit("messageLogs", messages)
//     })
// })


