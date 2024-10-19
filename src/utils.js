import {fileURLToPath} from 'url';
import {dirname} from 'path';
import bcrypt from 'bcrypt'
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

//Hashear contraseña
export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))

//Validar contraseña
export const isValidPassword= (user, password) => bcrypt.compareSync(password, user.password)


export const passportCall = (strategy) => {

    return async (req,res,next)=>{
        passport.authenticate(strategy, function(err, user, info){
            if(err){
                return next(err)
            }
            if(!user){
                return res.status(401).send({error: info.messages ? info.messages: info.toString()})
            }

            req.user = user
            next()
        })

        (req, res, next)
    }

}
