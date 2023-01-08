import { logger } from "../../../logger_config.js"
import { config } from '../../../config.js';
import { Order } from '../../models/orderDTO.js'


let instance = null;

export class firebaseOrderContainer {

    constructor() {
        this.db = config.firebase.db;
        this.query = this.db.collection('orders');
    }

    static getContainer() {
        if (!instance) {
            instance = new firebaseOrderContainer();
        }
        return instance;
    }

    ///Traigo el archivo y devuelvo el array.
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

    ////Agrego producto al array
    async addOrder(user, products) {
        try {
            const content = await this.getAll();
            //Defino el valor del id en base al contenido del archivo
            let lastId = 1;
            if (content.length > 0) {
                lastId = content[content.length - 1].id + 1;
            }
            let order = new Order(user, products);
            let newOrder = { ...order, id: lastId };
            let doc = this.query.doc(`${lastId}`);
            await doc.create(newOrder);
            return newOrder;
        } catch (err) {
            logger.log("error", `Error al crear la orden ${err}`);
        }
    }

    async getByID(id) {
        try {
            const doc = this.query.doc(`${id}`);
            const element = await doc.get();
            return element.data();
        } catch (err) {
            logger.log("error", `No se encontró la orden`);
        }
    }

    async getByUsr(username) {
        try {
            const orders = await this.getAll();
            let result = orders.filter((order) => order.usr === username);
            if (result.length > 0) {
                return result;
            } else {
                return null;
            }
        } catch (err) {
            logger.log("error", `No se encontraron ordenes ${err}`);
        }
    }

    async getProducts(id) {
        let order = await this.getByID(id);
        if (order) {
            return (order.products);
        } else {
            return (order);
        }
    }

    //Actualizo la lista de prods de una orden por id. 
    async updateOrder(id, prod) {
        try {
            const doc = this.query.doc(id);
            return await doc.update({ products: prod })
        } catch (err) {
            logger.log("error", `No se pudo modificar la orden ${err}`);
        }
    }

    //Cambio el estado de una orden
    async changeState(id, state) {
        try {
            let order = await this.getByID(id);
            if (order) {
                if (order.state !== "confirmada" && order.state !== "cancelada") {
                    const doc = this.query.doc(`${id}`);
                    await doc.update({ state: state })
                    return true;
                } else {
                    return false;
                }
            } else {
                return false
            }
        } catch (err) {
            logger.log("error", `No se pudo modificar la orden ${err}`);
        }
    }

}