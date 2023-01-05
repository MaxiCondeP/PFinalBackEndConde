import { config } from '../config.js';
import { User } from "../models/userDTO.js"
import { isValidPassword, createHash } from "../utils/utils.js"

let instance = null


export class firebaseUsrContainer {
    constructor() {
        this.db = config.firebase.db;
        this.query = this.db.collection('users');
    }

    static getContainer() {
        if (!instance) {
            instance = new firebaseUsrContainer();
        }
        return instance;
    }



    async getByUsr(username) {
        try {
            const doc = this.query.doc(`${username}`);
            const element = await doc.get();

            return element.data();

        } catch (err) {
            console.log("No se encontró el product", err)
            return { error: "No se encontró el product" }
        }

    }


    async getUsr(username, password) {
        try {
            const user = awaitgetByUsr(username);
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

    async newUsr(user) {
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
                const doc = this.query.doc();
                await doc.create(newUser);
                return newUser;
            }
        } catch (err) {
            console.log("Error al traer datos de la base", err)
            return { error: "Error al traer datos de la base", err }
        }
    }

    async userToAdmin(id) {
        try {
            const usr = await this.usrById(id);
            if (usr) {
                usr.isAdmin = true;
                await this.collection.findOneAndUpdate({ _id: usr._id }, usr);
            }
        } catch (err) {
            console.log("Error al traer datos de la base", err)
            return { error: "Error al traer datos de la base", err }
        }
    }






}
