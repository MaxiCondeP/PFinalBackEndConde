import * as fs from 'fs';
import { Cart } from '../../models/cartDTO.js'

let instance = null;


export class CartContainer {

    constructor(fileName) {
        this.name = fileName;
        this.fileRoute = "./public/" + this.name + ".txt";
    }


    static getContainer() {
        if (!instance) {
            instance = new CartContainer();
        }
        return instance;
    }

    //Recibo el contenido y lo escribo en el archivo
    async write(content) {
        try {
            //Parseo a JSON
            const fileContent = JSON.stringify(content, null, "\t");
            await fs.promises.writeFile(this.fileRoute, fileContent);
            //muestro el archivo escrito
            console.log(content);
        } catch (err) {
            return { error: "Error al escribir el archivo", err }
        }
    }

    ///Traigo el archivo y devuelvo el array.
    async getAll() {
        try {
            const content = await fs.promises.readFile(this.fileRoute, 'utf-8');
            return JSON.parse(content);
        }
        catch (err) {
            return { error: "Error al leer el archivo", err }
        }
    }


    ////Agrego producto al array
    async addCart() {
        try {
            const content = await this.getAll();
            //Defino el valor del id en base al contenido del archivo
            let lastId = 1;
            if (content.length > 0) {
                lastId = content[content.length - 1].id + 1;
            }
            let cart = new Cart();
            let newCart = { ...cart, id: lastId };
            //agrego el producto al array y lo escribo en el archivo
            content.push(newCart);
            await this.write(content);
            return lastId;
        } catch (err) {
            return { error: "Error al modificar el archivo", err }
        }
    }

    ////Se elimina carrito
    async delete(id) {
        try {
            const content = await this.getAll();
            const index = content.findIndex(cart => cart.id == id);
            if (index != -1) {
                content.splice(index, 1);
                await this.write(content);
            }
        } catch (err) {
            return { error: "Error al modificar el archivo", err }
        }
    }


    async getByID(id) {
        //traigo el array y lo filtro por ID
        let content = await this.getAll();
        const cart = content.find(c => c.id == id);
        if (cart) {
            return cart;
        } else {
            return { error: "No se encontró el carrito" }
        }
    }

    async getProducts(id) {
        let cart = await this.getByID(id);
        if (cart) {
            return (cart.products);
        } else {
            return (cart);
        }
    }


    //Actualizo la lista de prods de un carrito por id. 
    async updateCart(id, prod) {
        let cart = await this.getByID(id);
        let content = await this.getAll();
        const index = content.findIndex(c => c.id == id);
        if (cart) {
            cart.products = prod;
            content[index] = cart;
            await this.write(content);
        }
    }

    async isInCart(idProd, idCart) {
        let cart = this.getByID(idCart);

        if (prod) {
            return true
        } else {
            return false;
        }
    }


    ////Agrego prod al carrito
    async AddToCart(idCart, prod, qua) {
        try {
            let cart = await this.getByID(idCart);
            let index = cart.products.findIndex(p => p.id == prod.id);
            if (index == -1) {
                let newProd = { ...prod, quantity: qua }
                newProd.stock = newProd.stock - qua;
                cart.products.push(newProd);
            } else {
                cart.products[index].stock = cart.products[index].stock - qua;
                cart.products[index].quantity = cart.products[index].quantity + qua;
            }
            await this.updateCart(idCart, cart.products);
        } catch (err) {
            console.log('Error al agregar producto', err)
        }

    }


    //Elimino prod de carrito 
    async removeFromCart(idCart, idProd) {

        let cart = await this.getByID(idCart);
        const index = cart.products.findIndex(p => p.id == idProd);
        if (index != -1) {
            let deletedProd = cart.products[index]
            cart.products.splice(index, 1)
            await this.updateCart(idCart, cart.products);
            return deletedProd;

        } else {
            return { error: "Error , no se encontró el producto a eliminar", err }
        }
    }

}
