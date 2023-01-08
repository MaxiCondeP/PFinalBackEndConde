
let instance = null;


export class memoryMessageContainer {
    constructor() {
        this.messages = [];
    }

    static getContainer(nombreArchivo) {
        if (!instance) {
            instance = new memoryMessageContainer();
        }
        return instance;
    }

    ///traigo todos los msj del archivo
    async getAll() {
        return this.messages;
    }

    async save(message) {
        try {
            this.messages.push(message);
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