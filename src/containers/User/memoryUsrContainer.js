import { User } from '../../models/userDTO.js'
import { isValidPassword, createHash } from "../../utils/utils.js"


let instance = null;


export class memoryUsrContainer {

    constructor() {
        this.users = [];

    }


    static getContainer() {
        if (!instance) {
            instance = new memoryUsrContainer();
        }
        return instance;
    }


    ///Devuelvo el array.
    getAll() {
        return this.users;
    }


    getUsr(username, password) {
        try {
            const user = this.getByUsr(username);
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
            logger.log("error", `Error al traer datos de la base ${err}`);
        }
    }

    //Recibo el contenido y lo escribo en el archivo
    newUsr(user) {
        try {
            const usr = this.getByUsr(user.username);
            if (usr != null) {
                return null;
            } else {
                const hashedPassword = createHash(user.password);
                const name = user.name;
                const username = user.username;
                const password = hashedPassword;
                const age = user.age
                const phone = user.phone;
                const avatar = user.avatar
                let isAdmin = false;
                const address = user.address;
                if (user.isAdmin) { isAdmin = user.isAdmin }
                const newUser = new User(name, username, password, age, phone, avatar, address, isAdmin)
                this.users.push(newUser);
                return newUser;
            }
        } catch (err) {
            logger.log("error", `Error al guardar el usuario ${err}`);
        }
    }

    getByUsr(username) {
        //traigo el array y lo filtro por ID
        let content = this.users;
        let usr = null;
        if (this.users.length > 0) {
            usr = content.find(c => c.username == username);
        }
        if (usr) {
            return usr;
        } else {
            return null;
        }
    }
}
