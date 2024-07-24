import express from "express"
import handlebars from 'express-handlebars'
import __dirname from "./utils.js"
import { Server } from "socket.io"
import ejemploRouter from './routes/ejemplo.router.js'
// import cartsRouter from './routes/carts.router.js'
// import productsRouter from './routes/products.router.js'

const app = express()
const PORT = 8080


app.use(express.json())
app.use(express.urlencoded({extended: true}))


//handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views') 
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))


// app.use("/api", cartsRouter)
// app.use("/api", productsRouter) 
app.use("/", ejemploRouter) 

const httpServer = app.listen( PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})
// const socketServer = new Server(httpServer)

// let messages = []
 
//  socketServer.on('connection', socketServer => {
//      console.log('Nuevo cliente')

//      socket.on("message", data => {
//          messages.push(data)
//          socketServer.emit("messageLogs", messages)
//      })
//  })


