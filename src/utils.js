import {fileURLToPath} from 'url';
import {dirname} from 'path';
import productsModel from './models/product.model.js';

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
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'No se pueden cargar los productos', err });
    }
};


export default {__dirname, getProducts};