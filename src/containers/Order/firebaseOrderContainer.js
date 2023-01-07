import { config } from '../../../config.js';
import { Order } from '../../models/orderDTO.js'


let instance = null;

export class firebaseOrderContainer {

    constructor() {
        this.db = config.firebase.db;
        this.query = this.db.collection('carts');
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
            console.log("Error al traer datos de la base", err)
            return { error: "Error al traer datos de la base", err }
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
            return await doc.create(newOrder);
        } catch (err) {
            return { error: "Error al crear la orden", err }
        }
    }

    async getByID(id) {
        try {
            const doc = this.query.doc(`${id}`);
            const element = await doc.get();
            return element.data();
        } catch (err) {
            return { error: "No se encontró el cart" }
        }
    }

    async getByUsr(id) {
        try {
            const doc = this.query.doc.usr(`{usr:{id: ${id}}}`);
            const element = await doc.get();
            return element.data();
        } catch (err) {
            return { error: "No se encontró la order" }
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
            return { error: "No se pudo modificar la order" }
        }
    }

    async changeState(id, state) {
        try {
            const doc = this.query.doc(id);
            return await doc.update({ state: state })
        } catch (err) {
            return { error: "No se pudo modificar la order" }
        }
    }

}