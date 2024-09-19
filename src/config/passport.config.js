import passport from "passport";
import local from 'passport-local';
import userService from '../models/user.model.js';
import { createHash, isValidPassword } from "../utils.js";
import jwt from 'passport-jwt'

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt
const LocalStrategy = local.Strategy

const cookieExtractor = (req) => {
    let token = null
    console.log(req.headers)
    if (req && req.headers){
        token = req.headers.authorization.split(' ')[1]
    }
    return token
}

const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey:'coderSecret'
    }, async(jwt_payload, done) =>{
    try {
        return done (null, jwt_payload)
    } catch (error) {
        return done (error)
    }
}))

    passport.serializeUser((user, done) => {
        done (null, user._id)
    })

    passport.deserializeUser( async (id, done) =>{
        let user = await userService.findById(id)
        done(null, user)
    })

    passport.use('register', new LocalStrategy ({
        passReqToCallback: true, usernameField: 'email'}, async  (req, username, password, done) =>  {

            const { first_name, last_name, email, age } = req.body

            try {
                let user = await userService.findOne({email: username})
                if (user){
                    console.log("El usuario existe")
                    return done(null, false)
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password:createHash(password)
                }

                let result = await userService.create(newUser)
                return done(null, result)
                
                // let token = jwt.sign({ email: result.email, role: 'user' }, 'coderSecret', { expiresIn: '24h' });

                // res.send({ status: "success", message: "Usuario registrado", token });
            } catch
             (error) {

                return done("Error al obtener el usuario" + error)
            }
        }
    ))

    passport.use('login', new LocalStrategy({usernameField:'email'}, async(username,password,done) => {
        try {
            const user = await userService.findOne({email:username})
            if(!user){
                console.log("El usuario no existe")
                return done (null, false)
            }
            if(!isValidPassword(user,password)) return done(null, false)
                return done(null, user)

        } catch (error) {
            return done(error)            
        }
    }))
}

// const LocalStrategy = local.Strategy

//inicializamos estrategia local

/*const initializePassport = () => {
    passport.use('register', new LocalStrategy ({
        passReqToCallback: true, usernameField: 'email'}, async  (req, username, password) =>  {

            const { first_name, last_name, email, age } = req.body

            try {
                let user = await userService.findOne({email: username})
                if (user){
                    return res.status(400).send({ error: "Usuario ya existente" });

                }

                const newUser = new userService({
                    first_name,
                    last_name,
                    email,
                    age,
                    password:createHash(password)
                })

                let result = await userService.save(newUser)
                
                let token = jwt.sign({ email: result.email, role: 'user' }, 'coderSecret', { expiresIn: '24h' });

                res.send({ status: "success", message: "Usuario registrado", token });
            } catch
             (error) {

                res.status(500).send({ error: "Error en el registro: " + error });
            }
        }
    ))

    passport.serializeUser((user,done) => {
        done(null, user._id)
    })

    passport.deserializeUser( async (id, done) =>  {
        let user= await userService.findById(id)
        done(null, user)
    })

    passport.use('login', new LocalStrategy({usernameField:'email'}, async(username,password,done) => {
        try {
            const user = await userService.findOne({email:username})
            if(!user){
                console.log("El usuario no existe")
                return done (null, false)
            }
            if(!isValidPassword(user,password)) return done(null, false)
                return done(null, user)

        } catch (error) {
            return done(error)            
        }
    }))
}*/



export default initializePassport

