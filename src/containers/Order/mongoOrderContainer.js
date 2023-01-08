import { logger } from "../../../logger_config.js"
import { orderModel } from "../../models/modelsMongodb.js"
import { Order } from '../../models/orderDTO.js'


let instance = null;


export class mongoOrderContainer {

    constructor() {
        this.collection = orderModel;
    }


    static getContainer() {
        if (!instance) {
            instance = new mongoOrderContainer();
        }
        return instance;
    }

    ///Traigo el archivo y devuelvo el array.
    async getAll() {
        try {
            const content = await this.collection.find();
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
            order.id = lastId;
            //agrego el producto al array y lo escribo en el archivo
            const newElement = new this.collection(order);
            await newElement.save();
            return newElement;
        } catch (err) {
            logger.log("error", `Error al crear la orden ${err}`);
        }
    }

    async getByID(id) {
        try {
            let orderByID = await this.collection.findOne({ id: id });
            return orderByID;
        } catch (err) {
            logger.log("error", `No se encontró la orden ${err}`);
        }
    }

    async getByUsr(username) {
        try {
            let ordersByUsr = await this.collection.find({ usr: username });
            return ordersByUsr;
        } catch (err) {
            logger.log("error", `No se encontró el orden ${err}`);
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
            await this.collection.updateOne(
                { id: id },
                {
                    $set: { products: prod },
                }
            )
        } catch (err) {
            logger.log("error", `No se pudo modificar la orden ${err}`);
        }
    }

    //Cambio el estado de una orden
    async changeState(id, state) {
        try {
            let order = await this.getByID(id);;
            if (order) {
                if (order.state != "confirmada " && order.state != "cancelada") {
                    await this.collection.updateOne(
                        { id: id },
                        {
                            $set: { state: state },
                        }
                    );
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (err) {
            logger.log("error", `No se pudo modificar la orden ${err}`);
        }
    }
}
