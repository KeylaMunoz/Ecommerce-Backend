const express = require ("express")
const productsRouter = require ('./api/products.router.js')
const cartsRouter = require ('./api/carts.router.js')


const app = express()
const PORT = 8080


app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.use("/", productsRouter);
app.use("/", cartsRouter)





app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT}`)
})




