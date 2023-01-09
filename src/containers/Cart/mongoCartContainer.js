import { logger } from "../../../logger_config.js"
import { cartModel } from "../../models/modelsMongodb.js"
import { Cart } from '../../models/cartDTO.js'


let instance = null;


export class mongoCartContainer {

    constructor() {
        this.collection = cartModel;
    }


    static getContainer() {
        if (!instance) {
            instance = new mongoCartContainer();
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
            const newElement = new this.collection(newCart);
            await newElement.save();
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
                await this.collection.deleteOne({ id: id });
            }
        } catch (err) {
            logger.log("error", `Error al eliminar el cart de la bd ${err}`);
        }
    }



    async getByID(id) {
        let cart = await this.collection.findOne({ id: id });
        if (cart) {
            return cart;
        } else {
            return null;
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

        let cart = await this.getByID(idCart);
        let index = await cart.products.findIndex(p => p.id == prod.id);
        if (index == -1) {
            let newProd = prod
            newProd.quantity = qua;
            newProd.stock = newProd.stock - qua;
            cart.products.push(newProd);
        } else {
            cart.products[index].stock = cart.products[index].stock - qua;
            cart.products[index].quantity = cart.products[index].quantity + qua;
        }
        await this.collection.updateOne(
            { id: idCart },
            {
                $set: { products: cart.products },
            }
        )
        return cart.products
    } catch(err) {
        logger.log("error", `Error , no se pudo agregar el producto ${err}`);
    }


    //Elimino prod de carrito 
    async removeFromCart(idCart, idProd) {
        try {
            let cart = await this.getByID(idCart);
            let result = null;
            const index = cart.products.findIndex(p => p.id == idProd);
            if (index != -1) {
                result = cart.products[index];
                cart.products.splice(index, 1)
                await this.collection.updateOne(
                    { id: idCart },
                    {
                        $set: { products: cart.products },
                    }
                )
            }
            return result;
        } catch (err) {
            logger.log("error", `Error , no se encontró el producto a eliminar ${err}`);
        }
    }

}
