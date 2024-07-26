import { promises as fs } from 'fs';
import {fileURLToPath} from 'url';
import {dirname} from 'path';


const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

//Funcion para leer el archivo
export async function readJsonFile(fileJson) {
    
    try {
        const data = await fs.readFile(fileJson, 'utf8');
        return JSON.parse(data);

    } catch (err) {
        res.status(400).json({ message: 'No se puede leer el archivo' });
    }
}

//Funcion para escribir en el archivo
export async function writeJsonFile(fileJson, data) {
    try {
        await fs.writeFile(fileJson, JSON.stringify(data, null, 2), 'utf8');
    
    } catch (err) {
        res.status(400).json({ message: 'No se puede escribir en el archivo' });
    }
}


//Funcion para crear el archivo si no existe
export async function existsJsonFile(fileJson) {
    try {
        await fs.access(fileJson);
    
    } catch (err) {
        await writeJsonFile(fileJson, []);
    }
}



export default { __dirname, readJsonFile, writeJsonFile, existsJsonFile}