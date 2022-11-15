import { usrModel } from "../models/modelsMongodb.js"
import { isValidPassword, createHash } from "../utils/utils.js"


///Creo la clase Producto
export class User {
    constructor(name, username, password, age, phone, avatar) {
        this.name = name;
        this.username = username;
        this.password = password;
        this.age = age;
        this.phone = phone,
            this.avatar = avatar
    }

}
///creo la clase Contenedor

export class mongoUsrContainer {
    constructor() {
        this.collection = usrModel;
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
            console.log("Error al traer datos de la base", err)
            return { error: "Error al traer datos de la base", err }
        }

    }

    async usrById(id) {
        try {
            const user = await this.collection.findById(id);

            return user;
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
                const newUser = new this.collection({ name, username, password, age, phone, avatar })
                await newUser.save();
                return newUser;
            }
        } catch (err) {
            console.log("Error al traer datos de la base", err)
            return { error: "Error al traer datos de la base", err }
        }
    }
}