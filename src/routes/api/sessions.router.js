import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import initializePassport from '../../config/passport.config.js';
import { passportCall } from '../../utils.js';

const router = Router();
initializePassport()

router.post('/register', passport.authenticate('register', { failureRedirect: 'failregister' }), async (req, res) => {
    res.status(200).send({ status: "success", message: "usuario registrado" })
});

router.get('/failregister', async (req, res) => {
    console.log('estategia fallida')
    res.status(401).send({ error: "Failed"})
} )

router.post('/login',  passport.authenticate('login', { failureRedirect: 'faillogin' }), async (req, res) => {
    
    const { email, password } = req.body;
    
    try {
        const token = jwt.sign({ email, password, role: "user" }, 'coderSecret', { expiresIn: '24h' });

        req.session.user = {
            first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email 
        }
        console.log("token:", token)

         res.status(200).redirect('/profile'); 

    } catch (error) {
        res.status(500).send({ error: "Error en el inicio de sesión: " + error });
    }
});

router.get('/faillogin', (req, res) => {
    res.status(401).send({ error: "Credenciales inválidas"})
})



router.get('/current', passportCall('jwt'), (req, res) => {
    res.send(req.user)
});


router.post('/logout', (req, res) => {
    req.session.destroy((err) =>  {
        if (err) return res.status(500).send('Error al cerrar sesion')
            res.redirect('/login');
    })
})

export default router;
