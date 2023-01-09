import { config } from '../../../config.js';
import { logger } from "../../../logger_config.js"
import { isValidPassword, createHash } from "../../utils/utils.js"

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

    async getAll() {
        try {
            const querySnapshot = await this.query.get();
            let docs = querySnapshot.docs;
            const content = docs.map((doc) => (doc.data()));
            return (content);
        }
        catch (err) {
            logger.log("error", `Error al traer datos de la base ${err}`);
        }
    }



    async getByUsr(username) {
        try {
            const users = await this.getAll();
            let user = users.find(c => c.username == username)
            if (user) {
                return user;
            } else {
                return null;
            }
        } catch (err) {
            logger.log("error", `Error al traer datos de la base ${err}`);
        }

    }


    async getUsr(username, password) {
        try {
            const user = await this.getByUsr(username);
            let passHash = " ";
            if (user) {
                passHash = user.password;
            }
            if (user && isValidPassword(password, passHash)) {
                return user;
            } else {
                return null
            }
        } catch (err) {
            logger.log("error", `Error al traer datos de la base ${err}`);
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
                const avatar = user.avatar;
                const address = user.address;
                let isAdmin = false;
                if (user.isAdmin) { isAdmin = user.isAdmin }
                const newUser = { name, username, password, age, phone, avatar, address, isAdmin }
                const doc = this.query.doc();
                await doc.create(newUser);
                return newUser;
            }
        } catch (err) {
            logger.log("error", `Error al guardar el usuario ${err}`);
        }
    }
}