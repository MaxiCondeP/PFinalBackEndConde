import { logger } from "../../../logger_config.js"
import * as fs from 'fs';
import { Order } from '../../models/orderDTO.js'

let instance = null;

export class OrderContainer {

    constructor(fileName) {
        this.name = fileName;
        this.fileRoute = "./public/" + this.name + ".txt";
    }

    static getContainer(fileName) {
        if (!instance) {
            instance = new OrderContainer(fileName);
        }
        return instance;
    }

    //Recibo el contenido y lo escribo en el archivo
    async write(content) {
        try {
            //Parseo a JSON
            const fileContent = JSON.stringify(content, null, "\t");
            await fs.promises.writeFile(this.fileRoute, fileContent);
        } catch (err) {
            logger.log("error", `Error al escribir el archivo ${err}`);
        }
    }

    ///Traigo el archivo y devuelvo el array.
    async getAll() {
        try {
            const content = await fs.promises.readFile(this.fileRoute, 'utf-8');
            return JSON.parse(content);
        }
        catch (err) {
            logger.log("error", `Error al leer el archivo ${err}`);
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
            //agrego el producto al array y lo escribo en el archivo
            content.push(newOrder);
            await this.write(content);
            return newOrder;
        } catch (err) {
            logger.log("error", `Error al crear la orden ${err}`);
        }
    }


    async getByID(id) {
        //traigo el array y lo filtro por ID
        let content = await this.getAll();
        const order = content.find(c => c.id == id);
        if (order) {
            return order;
        } else {
            return null;
        }
    }


    async getByUsr(username) {
        //traigo el array y lo filtro por ID
        let content = await this.getAll();
        const orders = content.filter(c => c.usr == username);
        if (orders) {
            return orders;
        } else {
            return null;
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
        let order = await this.getByID(id);
        let content = await this.getAll();
        const index = content.findIndex(c => c.id == id);
        if (order) {
            order.products = prod;
            content[index] = order;
            await this.write(content);
        }
    }

    //Cambio el estado de una orden
    async changeState(id, state) {
        let order = await this.getByID(id);
        let content = await this.getAll();
        const index = content.findIndex(c => c.id == id);
        if (order) {
            if (order.state != "confirmada" && order.state != "cancelada") {
                order.state = state;
                content[index] = order;
                await this.write(content);
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

}

