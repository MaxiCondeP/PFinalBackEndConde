import { msgModel } from '../../models/modelsMongodb.js';
import { logger } from "../../../logger_config.js"

let instance = null;



export class mongoMessageContainer {
    constructor() {
        this.collection = msgModel;
    }

    static getContainer() {
        if (!instance) {
            instance = new mongoMessageContainer();
        }
        return instance;
    }

    ///traigo todos los msj del archivo
    async getAll() {
        try {
            const content = await this.collection.find();

            return (content);
        }
        catch (err) {
            logger.log("error", `Error al leer el historial de mensajes ${err}`);
        }
    }



    async save(message) {
        try {
            const newElement = new this.collection(message);
            await newElement.save();
        }
        catch (err) {
            logger.log("error", `Error al actualizar el historial de mensajes ${err}`);

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