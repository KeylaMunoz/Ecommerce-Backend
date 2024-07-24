import express from "express"
import __dirname from "../utils.js"

const router = express.Router();


 router.get("/", (req, res) => {
    let usuario = {
        name: "keyla"
    }
     res.render("home", usuario)

 })


  
export default router;