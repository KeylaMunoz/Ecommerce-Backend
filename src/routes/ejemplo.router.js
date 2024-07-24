import express from "express"
import __dirname from "../utils.js"

const router = express.Router();

let products = await readJsonFile('productos.json')


// router.get("/", (req, res) => {
//     let testUser = {
//         name: "Keyyyla",
//         role: "admin"
//     }
//     res.render('index', {
//         user: testUser,
//         isAdmin: testUser.role === "admin",
//         food
//     })
// })


  
export default router;