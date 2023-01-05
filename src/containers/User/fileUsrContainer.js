import { User } from "../models/userDTO.js"
import { isValidPassword, createHash } from "../utils/utils.js"
import * as fs from 'fs';

let instance = null;



export class fileUsrContainer {

    constructor(fileName) {
        this.name = fileName;
        this.fileRoute = "./public/" + this.name + ".txt";
    }


    static getContainer() {
        if (!instance) {
            instance = new fileUsrContainer();
        }
        return instance;
    }

    async getUsr(username, password) {
        try {
            const user = getByUsr(username);
            let passHash = " ";
            if (user) {
                passHash = user.password;
            }
            if (!user || !isValidPassword(password, passHash)) {
                return null;
            } else {
                return user;
            }
        } catch (err) {
            console.log("Error al traer datos de la base", err)
            return { error: "Error al traer datos de la base", err }
        }
    }

    //Recibo el contenido y lo escribo en el archivo
    async write(user) {
        try {
            const usr = await this.getUsr(user.username, user.password);
            if (usr) {
                return null;
            } else {
                const hashedPassword = createHash(user.password);
                const name = user.name;
                const username = user.username;
                const password = hashedPassword;
                const age = user.age
                const phone = user.phone;
                const avatar = user.avatar
                const isAdmin = false;
                const newUser = new User(name, username, password, age, phone, avatar, isAdmin)
                //Parseo a JSON
                let content = await this.getAll();
                content.push(newUser);
                const fileContent = JSON.stringify(content, null, "\t");
                await fs.promises.writeFile(this.fileRoute, fileContent);
            }
        } catch (err) {
            return { error: "Error al escribir el archivo", err }
        }
    }

    ///Traigo el archivo y devuelvo el array.
    async getAll() {
        try {
            const content = await fs.promises.readFile(this.fileRoute, 'utf-8');
            return JSON.parse(content);
        }
        catch (err) {
            return { error: "Error al leer el archivo", err }
        }
    }


    async getByUsr(username) {
        //traigo el array y lo filtro por ID
        let content = await this.getAll();
        const usr = content.find(c => c.username == username);
        if (usr) {
            return usr;
        } else {
            return { error: "No se encontró el carrito" }
        }
    }

    async usrById(id) {
        //traigo el array y lo filtro por ID
        let content = await this.getAll();
        const usr = content.find(c => c.id == id);
        if (usr) {
            return usr;
        } else {
            return { error: "No se encontró el carrito" }
        }
    }

    async userToAdmin(username) {
        try {
            const usr = await this.getByUsr(username);
            if (usr) {
                usr.isAdmin = true;
                let content = await this.getAll();
                const usrIndex = content.findIndex(c => c.username == username);
                content[usrIndex].isAdmin=true;
                const fileContent = JSON.stringify(content, null, "\t");
                await fs.promises.writeFile(this.fileRoute, fileContent);
            }
        } catch (err) {
            return { error: "Error al escribir el archivo", err }
        }
    }

}
