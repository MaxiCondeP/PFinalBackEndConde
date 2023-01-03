
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
            console.log("Error al leer historial de mensajes", err);
        }
    }

    async save(message) {
        try {

            this.messages.push(message);

        }
        catch (err) {
            console.log("Error al actualizar historial de mensajes", err);

        }

    }
}