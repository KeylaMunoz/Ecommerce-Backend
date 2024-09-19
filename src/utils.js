import {fileURLToPath} from 'url';
import {dirname} from 'path';
import productsModel from './models/product.model.js';
import bcrypt from 'bcrypt'
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)


export const getProducts = async (queryParams) => {
    let query = {};
    let sort = {};
    let page = parseInt(queryParams.page) || 1;
    let limit = parseInt(queryParams.limit) || 10;
    const { category, sort: sortOrder, title } = queryParams;

    if (category) { query.category = category; }

    if (title) { query.title = new RegExp(title, 'i'); }

    if (sortOrder) { sort.price = sortOrder === 'asc' ? 1 : -1; }

    const options = {
        limit,
        sort,
        page,
        lean: true
    };

    try { 
        const result = await productsModel.paginate(query, options);
        return result;
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'No se pueden cargar los productos', error });
    }
};

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

export default {__dirname, getProducts};