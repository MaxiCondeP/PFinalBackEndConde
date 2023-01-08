import { config } from '../../../config.js';
import { logger } from "../../../logger_config.js"

let instance = null;

export class firebaseMessageContainer {
    constructor() {
        this.db = config.firebase.db;
        this.query = this.db.collection('messages');
    }

    static getContainer() {
        if (!instance) {
            instance = new firebaseMessageContainer();
        }
        return instance;
    }

    ///traigo todos los msj del archivo
    async getAll() {
        try {
            const querySnapshot = await this.query.get();
            let docs = querySnapshot.docs;
            const chat = docs.map((doc) => (doc.data()));
            return (content);
        }
        catch (err) {
            logger.log("error", `Error al leer el historial de mensajes ${err}`);
        }
    }

    async save(message) {
        try {
            const doc = this.query.doc()
            await doc.create({ author: message.author, text: message.text, date: message.date });
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