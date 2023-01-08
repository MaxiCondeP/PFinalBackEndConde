import * as fs from 'fs';
import { logger } from "../../../logger_config.js"

let instance = null;


export class fileMessageContainer {
    constructor(nombreArchivo) {
        this.nombre = nombreArchivo;
        this.rutaDeArchivo = "./public/" + this.nombre + ".txt";
    }

    static getContainer(nombreArchivo) {
        if (!instance) {
            instance = new fileMessageContainer(nombreArchivo);
        }
        return instance;
    }

    ///traigo todos los msj del archivo
    async getAll() {
        try {
            const archivo = await fs.promises.readFile(this.rutaDeArchivo, 'utf-8');
            const chat = JSON.parse(archivo);
            return chat;
        }
        catch (err) {
            logger.log("error", `Error al leer el historial de mensajes ${err}`);
        }
    }

    async save(message) {
        try {
            const messages = await this.getAll();
            //genero el id para cada msj
            messages.push(message);
            const newFile = JSON.stringify(messages, null, "\t");
            await fs.promises.writeFile(this.rutaDeArchivo, newFile);
        }
        catch (err) {
            logger.log("error", `Error al escribir el archivo ${err}`);
        }
    }

    async getByUsr(email) {
        try {
            const messages = await this.getAll();
            return messages.filter((c) => c.author.email == email)
        }
        catch (err) {
            logger.log("error", `Error al leer el historial de mensajes ${err}`);
        }
    }
}