
import passport from "passport";
import local from 'passport-local';
import User from "../dao/classes/user.dao.js"
import { UserDTO } from "../dto/user.dto.js";
import { createHash, isValidPassword } from "../utils.js";

const userService = new User()
const LocalStrategy = local.Strategy

//LOGIN
export const loginStrategy = () => {
    passport.use('login', new LocalStrategy({usernameField:'email'}, async(username,password,done) => {
        try {
            const user = await userService.getUserByEmail(username) 
            if(!user){
                console.log("El usuario no existe, regístrate!")
                return done (null, false)
            }
            if(!isValidPassword(user,password)) { 
                console.log("Usuario o contraseña inválidos")
                return done(null, false)
            }

            const userDTO = new UserDTO(user);
            
            console.log("Usuario logueado:", userDTO); 
            return done(null, userDTO)

        } catch (error) {
            return done("Error al intentar loguearte", error)            
        }
    }))
}

export const registerStrategy = () => {
    passport.use('register', new LocalStrategy ({
        passReqToCallback: true,
        usernameField: 'email'
    }, async  (req, username, password, done) =>  {
        
        const { first_name, last_name, email, age } = req.body
        
        try {
            let user = await userService.getUserByEmail(username)
                if (user){
                    console.log("El usuario ya existe")
                    return done(null, false)
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password:createHash(password)
                }
                
                let result = await userService.saveUser(newUser)
                console.log("Usuario registrado correctamente")
                
                const userDTO = new UserDTO(result);
                return done(null, userDTO);
                
            } catch
            (error) {
                return done("Error al obtener el usuario" + error)
            }
        }
    ))
}


export const serializeUser = () => {
    passport.serializeUser((user, done) => {
        done (null, user.id)
    })
}

export const deserializeUser = () => {
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userService.getUserById(id);
            if (!user) {
                return done(null, false);
            }
            const userDTO = new UserDTO(user);
            done(null, userDTO); 
        } catch (error) {
            done(error);
        }
    });
}

//Registro

export const register = (req, res) => {
    res.status(200).send({ status: "success", message: "Usuario registrado" });
};



export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userDTO = new UserDTO(req.user);
        req.session.user = userDTO;
        console.log(userDTO);
        res.status(200).redirect('/');
    } catch (error) {
        res.status(500).send({ error: "Error en el inicio de sesión: " + error });
    }
};


//Cerrar sesión
export const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
};

//Fallos
export const failRegister = (req, res) => {
    console.log('Estrategia de registro fallida');
    res.status(401).send({ error: "Fallo en el registro" });
};

export const failLogin = (req, res) => {
    res.status(401).send({ error: "Credenciales inválidas" });
};
      

//current
export const currentUser = (req, res) => {
    try {
        if (req.session.user) {
            const userDTO = new UserDTO(req.session.user); 
            res.render('current', { user: userDTO });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        res.status(500).send({ error: "Error para mostrar current " + error }); 
    }
}




