import {Router} from "express";

const router = Router()

router.get('/setCookie', (req, res)=> {
    res.cookie('Cookie', 'soy un valor', {maxAge: 1000}).send('mensajito')
})

export default router