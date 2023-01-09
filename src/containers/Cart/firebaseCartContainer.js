import { logger } from "../../../logger_config.js"
import { config } from '../../../config.js';
import { Cart } from '../../models/cartDTO.js'



let instance = null;



export class firebaseCartContainer {

    constructor() {
        this.db = config.firebase.db;
        this.query = this.db.collection('carts');
    }


    static getContainer() {
        if (!instance) {
            instance = new firebaseCartContainer();
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
    async addCart(username, address) {
        try {
            const content = await this.getAll();
            //Defino el valor del id en base al contenido del archivo
            let lastId = 1;
            if (content.length > 0) {
                lastId = content[content.length - 1].id + 1;
            }
            let cart = new Cart(username, address);
            let newCart = { ...cart, id: lastId };
            //agrego el producto a la db, y devuelvo el resultado
            let doc = this.query.doc(`${lastId}`);
            await doc.create(newCart);
            return lastId;
        } catch (err) {
            logger.log("error", `Error al crear el cart ${err}`);
        }
    }

    ////Se elimina carrito
    async delete(id) {
        try {
            const content = await this.getAll();
            const index = content.findIndex(cart => cart.id == id);
            if (index != -1) {
                ///si existe el id lo elimino
                await this.query.doc(`${id}`).delete();
            }
        } catch (err) {
            logger.log("error", `Error al eliminar el cart de la bd ${err}`);
        }
    }


    async getByID(id) {
        try {
            const doc = this.query.doc(`${id}`);
            const element = await doc.get();
            return element.data();
        } catch (err) {
            logger.log("error", `Error al buscar en la bd ${err}`);
        }
    }

    async getProducts(id) {
        let cart = await this.getByID(id);
        if (cart) {
            return (cart.products);
        } else {
            return null;
        }
    }


    ////Agrego prod al carrito
    async AddToCart(idCart, prod, qua) {
        try {
            let cart = await this.getByID(idCart);
            let index = await cart.products.findIndex(p => p.id == prod.id);
            if (index == -1) {
                let newProd = { ...prod, quantity: qua }
                newProd.stock = newProd.stock - qua; +
                    cart.products.push(newProd);
            } else {
                cart.products[index].stock = cart.products[index].stock - qua;
                cart.products[index].quantity = cart.products[index].quantity + qua;
            }
            const doc = this.query.doc(idCart);
            await doc.update({ products: cart.products })
            return cart.products
        } catch (err) {
            logger.log("error", `Error , no se pudo agregar el producto ${err}`);
        }
    }


    //Elimino prod de carrito 
    async removeFromCart(idCart, idProd) {
        try {
            let cart = await this.getByID(idCart);
            let prod = null;
            const index = cart.products.findIndex(p => p.id == idProd);
            if (index != -1) {
                prod = cart.products[index];
                cart.products.splice(index, 1)
                const doc = await this.query.doc(`${idCart}`);
                await doc.update({ products: cart.products })
                return prod;
            }
        } catch (err) {
            logger.log("error", `Error , no se encontró el producto a eliminar ${err}`);
        }
    }

}
