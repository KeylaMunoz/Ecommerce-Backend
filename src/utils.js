import { promises as fs } from 'fs';
import {fileURLToPath} from 'url'
import {dirname, resolve} from 'path'


const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)


export async function readJsonFile(filePath) {
    const fullPath = resolve(__dirname, filePath);

    try {
        const data = await fs.readFile(fullPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error('No se puede leer el archivo');
    }
}

export async function writeJsonFile(filePath, data) {
    const fullPath = resolve(__dirname, filePath);

    try {
        await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        throw new Error('No se puede escribir en el archivo');
    }
}

export async function existsJsonFile(filePath) {
    const fullPath = resolve(__dirname, filePath);
    
    try {
        await fs.access(fullPath);
    } catch (err) {
        await writeJsonFile(filePath, []);
    }
}



export default { __dirname, readJsonFile, writeJsonFile, existsJsonFile}