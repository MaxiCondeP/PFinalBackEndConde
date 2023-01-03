import * as fs from 'fs';

let instance= null;


export class fileMessageContainer {
    constructor(nombreArchivo) {
        this.nombre = nombreArchivo;
        this.rutaDeArchivo = "./public/" + this.nombre + ".txt";
    }

    static getContainer(nombreArchivo){
        if(!instance){
            instance=new fileMessageContainer(nombreArchivo);
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
            console.log("Error al leer historial de mensajes", err);
        }
    }

    async save(message) {
        try {
            const messages = await this.getAll();
            //genero el id para cada msj
            messages.push(message);
            const newFile=JSON.stringify(messages, null, "\t");
            await fs.promises.writeFile(this.rutaDeArchivo, newFile);

        }
        catch (err) {
            console.log("Error al actualizar historial de mensajes", err);

         }

    }
}