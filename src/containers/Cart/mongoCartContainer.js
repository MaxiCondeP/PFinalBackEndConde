import {cartModel} from "../../models/modelsMongodb.js"
import {Cart} from '../../models/cartDTO.js'


let instance=null;


export class mongoCartContainer {

    constructor() {
        this.collection = cartModel;
    }

    
    static getContainer(){
        if(!instance){
            instance=new mongoCartContainer();
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
            console.log("Error al traer datos de la base", err)
            return { error: "Error al traer datos de la base", err }
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
            //agrego el producto a la db, y devuelvo el resultado
            const result = await this.collection.insertOne(newCart);
            return result;
        } catch (err) {
            console.log("Error al crear el cart", err )
            return { error: "Error al crear el cart", err }
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
            console.log("Error eliminar el cart de la bd", err)
            return { error: "Error eliminar el cart de la bd", err }
        }
    }


    async getByID(id) {
        try {
            let cartByID = await this.collection.findOne({ id: id });
            return cartByID;
        } catch (err) {
            console.log("No se encontró el cart" , err )
            return { error: "No se encontró el cart" }
        }
    }

    async getProducts(id) {
        let cart = await this.getByID(id);
        return (cart.products);
    }


    ////Agrego prod al carrito
    async AddToCart(idCart, prod, qua) {

        let cart = await this.getByID(idCart);
        let index = await cart.products.findIndex(p => p.id == prod.id);
        if (index == -1) {
            let newProd = { ...prod, quantity: qua }
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
    } catch(err) {
        console.log("Error , no se pudo agregar el producto", err )
        return { error: "Error , no se pudo agregar el producto", err }
    }


    //Elimino prod de carrito 
    async removeFromCart(idCart, idProd) {
        try {
            let cart = await this.getByID(idCart);
            const index = cart.products.findIndex(p => p.id == idProd);
            if (index != -1) {
                cart.products.splice(index, 1)
                await this.collection.updateOne(
                    { id: id },
                    {
                        $set: { products: cart.products },
                    }
                )
            }
        } catch (err) {
            console.log("Error , no se encontró el producto a eliminar", err )
            return { error: "Error , no se encontró el producto a eliminar", err }
        }
    }

}
