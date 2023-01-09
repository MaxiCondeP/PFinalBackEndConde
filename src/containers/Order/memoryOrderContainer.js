import { Order } from '../../models/orderDTO.js'

let instance = null;

export class memoryOrderContainer {

    constructor() {
        this.orders = [];
    }

    static getContainer() {
        if (!instance) {
            instance = new memoryOrderContainer();
        }
        return instance;
    }


    ///Traigo el archivo y devuelvo el array.
    getAll() {
        return this.orders;
    }

    ////Agrego producto al array
    addOrder(user, products) {
        const content = this.getAll();
        //Defino el valor del id en base al contenido del archivo
        let lastId = 1;
        if (content.length > 0) {
            lastId = content[content.length - 1].id + 1;
        }
        let order = new Order(user, products);
        let newOrder = { ...order, id: lastId };
        //agrego el producto al array y lo escribo en el archivo
        this.orders.push(newOrder);
        return lastId;
    }


    getByID(id) {
        //traigo el array y lo filtro por ID
        let content = this.getAll();
        const order = content.find(c => c.id == id);
        if (order) {
            return order;
        } else {
            return { error: "No se encontró la orden" }
        }
    }


    getByUsr(email) {
        //traigo el array y lo filtro por ID
        let content = this.getAll();
        const orders = content.filter(c => c.usr.email == email);
        if (orders) {
            return orders;
        } else {
            return null;
        }
    }

    getProducts(id) {
        let order = this.getByID(id);
        if (order) {
            return (order.products);
        } else {
            return (order);
        }
    }

    //Actualizo la lista de prods de un carrito por id. 
    updateOrder(id, prod) {
        let order = this.getByID(id);
        const index = this.orders.findIndex(c => c.id == id);
        if (order) {
            order.products = prod;
            this.orders[index] = order;
        }
    }

    //Cambio el estado de una orden
    changeState(id, state) {
        let order = this.getByID(id);
        const index = this.orders.findIndex(c => c.id == id);
        if (order) {
            if (order.state != "confirmada" && order.state != "cancelada") {
                order.state = state;
                this.orders[index] = order;
                return true;
            } else {
                return false;
            }
        } else {
            return false
        }
    }
}

