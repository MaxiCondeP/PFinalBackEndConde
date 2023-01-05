
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
        try {
            return this.messages;
        }
        catch (err) {
            return { error: "Error al leer historial de mensajes", err };
        }
    }

    async save(message) {
        try {
            this.messages.push(message);
        }
        catch (err) {
            return { error: "Error al actualizar historial de mensajes", err }

        }
    }

    async getByUsr(email) {
        try {
            const messages = await this.getAll();
            return messages.filter((c) => c.author.email == email)
        }
        catch (err) {
            return { error: "Error al actualizar historial de mensajes", err };

        }
    }

}