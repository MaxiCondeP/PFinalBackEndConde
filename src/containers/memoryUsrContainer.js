import { User } from '../models/userDTO.js'
import { isValidPassword, createHash } from "../utils/utils.js"


let instance = null;


export class memoryUsrContainer {

    constructor() {
        this.users = [];

    }


    static getContainer() {
        if (!instance) {
            instance = new fileUsrContainer();
        }
        return instance;
    }


    ///Devuelvo el array.
    getAll() {
        return this.users;
    }


    getUsr(username, password) {
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
    newUsr(user) {
        try {
            const usr = this.getUsr(user.username, user.password);
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
                this.users.push(newUser);
            }
        } catch (err) {
            return { error: "Error al escribir el archivo", err }
        }
    }

    getByUsr(username) {
        //traigo el array y lo filtro por ID
        let content = this.users;
        const usr = content.find(c => c.username == username);
        if (usr) {
            return usr;
        } else {
            return { error: "No se encontró el usuario" }
        }
    }


    userToAdmin(username) {
        try {
            const usr = this.getByUsr(username);
            if (usr) {
                usr.isAdmin = true;
                const usrIndex = this.users.findIndex(c => c.username == username);
                this.users[usrIndex].isAdmin = true;

            }
        } catch (err) {
            return { error: "Error al modificar el usuario", err }
        }
    }

}
