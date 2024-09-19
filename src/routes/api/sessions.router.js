import { Router } from 'express';
import passport from 'passport';
import User from '../../models/user.model.js'
import { createHash, isValidPassword } from '../../utils.js';
import jwt from 'jsonwebtoken';
import initializePassport from '../../config/passport.config.js';
import { passportCall } from '../../utils.js';

const router = Router();
initializePassport()

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    res.send({ status: "success", message: "usuario registrado" })
});


router.post('/login',  passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
    
    const { email, password } = req.body;
    
    try {
        if (!req.user) return res.status(400).send({status: "error", error: "Credenciales invalidas"})

        const token = jwt.sign({ email, password }, 'coderSecret', { expiresIn: '24h' });

        req.session.user = {
            first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
        }
        console.log(req.user, token)

        res.redirect('/profile');
        // res.send({ status: "success", payload: req.user})
        
    } catch (error) {
        res.status(500).send({ error: "Error en el inicio de sesión: " + error });
    }
});

router.get('/faillogin', (req, res) => {
    
    res.send({ error: "Login fallido"})
})


router.get('/failregister', async (req, res) => {
    console.log('estategia fallida')
    res.send({ error: "Failed"})
} )

router.get('/current', passportCall('jwt'), (req, res) => {
    const { email, role } = req.user;

    // Generar un nuevo token basado en la información del usuario actual
    const token = jwt.sign({ email, role }, 'coderSecret', { expiresIn: '24h' });

    // Devolver tanto el token como los datos del usuario en un objeto
    res.status(200).send({
        status: 'success',
        user: req.user,
        token: token
    });
});


router.post('/logout', (req, res) => {
    req.session.destroy((err) =>  {
        if (err) return res.status(500).send('Error al cerrar sesion')
            res.redirect('/login');
    })
})

export default router;

/*router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: "Usuario no encontrado" });
        }

        if (!isValidPassword(user, password)) {
            return res.status(400).send({ error: "Contraseña incorrecta" });
        }
        
        const token = jwt.sign({ email: user.email, role: 'user' }, 'coderSecret', { expiresIn: '24h' });

        res.send({ status: "success", message: "Inicio de sesión exitoooooso", token });
    } catch (error) {
        res.status(500).send({ error: "Error en el inicio de sesión: " + error });
    }
});*/

// router.post('/loginn', (req, res) => {
    
    //     const { email, password } = req.body


//     if (email == "keyla@email.com" && password == "123") {
//         let  token = jwt.sign({email, password, role: "user"}, 'coderSecret', {expiresIn:"24h"})
//         res.send({message:"Inicio de sesión exitoso", token})
//     }
// })


/*router.post('/register', async (req, res) => {

    const { first_name, last_name, email, age, password } = req.body;

    try {
        let user = await User.findOne({ email});
        if (user) {
            return res.status(400).send({ error: "Usuario ya existente" });
        }

        const newUser = new User({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        });

        let result = await newUser.save(newUser);

        let token = jwt.sign({ email: result.email, role: 'user' }, 'coderSecret', { expiresIn: '24h' });

        res.send({ status: "success", message: "Usuario registrado", token });
    } catch (error) {
        res.status(500).send({ error: "Error en el registro: " + error });
    }

} ) ;*/