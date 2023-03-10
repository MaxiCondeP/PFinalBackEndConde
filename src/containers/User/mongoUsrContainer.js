import { usrModel } from "../../models/modelsMongodb.js"
import { isValidPassword, createHash } from "../../utils/utils.js"
import { logger } from "../../../logger_config.js"

let instance = null;



///creo la clase Contenedor

export class mongoUsrContainer {
    constructor() {
        this.collection = usrModel;
    }

    static getContainer() {
        if (!instance) {
            instance = new mongoUsrContainer();
        }
        return instance;
    }

    async getUsr(username, password) {
        try {
            const user = await this.collection.findOne({ username });
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

    async usrById(id) {
        try {
            const user = await this.collection.findById(id);
            return user;
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
                const hashedPassword = createHash(user.password.toString());
                const name = user.name;
                const username = user.username;
                const password = hashedPassword;
                const age = user.age
                const phone = user.phone;
                const avatar = user.avatar
                let isAdmin = false;
                const address = user.address;
                if (user.isAdmin) { isAdmin = user.isAdmin }
                const newUser = new this.collection({ name, username, password, age, phone, avatar, address, isAdmin })
                await newUser.save();
                return newUser;
            }
        } catch (err) {
            logger.log("error", `Error al guardar el usuario ${err}`);
        }
    }


}