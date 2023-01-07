import { productModel } from "../../models/modelsMongodb.js"
import { Product } from '../../models/productDTO.js'


let instance = null;


export class mongoProductContainer {
    constructor() {
        this.collection = productModel;
    }


    static getContainer() {
        if (!instance) {
            instance = new mongoProductContainer();
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
            return { error: "Error al traer datos de la base", err }
        }
    }


    ////Agrego producto al array
    async save(product) {
        try {
            const content = await this.getAll();
            //Defino el valor del id en base al contenido del archivo
            let lastId = 1;
            if (content.length > 0) {
                lastId = content[content.length - 1].id + 1;
            }
            let newProduct = new Product(product.title, product.price, product.thumbnail, product.stock, lastId, product.category)
            //agrego el producto a la mongo
            const newElement = new this.collection(newProduct);
            await newElement.save();
            //devuelvo el último id o null
            if (lastId == -1) { lastId = null }
            return lastId;
        } catch (err) {
            return { error: "Error al modificar el archivo", err }
        }
    }

    ////Devuelvo un  producto por el ID
    async getByID(id) {
        try {
            let prod = await this.collection.findOne({ id: id });
            if (prod) {
                return prod;
            } else {
                return null;
            }

        } catch (err) {
            return { error: "No se encontró el product" }
        }
    }

    async editByID(id, newProd) {
        try {
            let prod = await this.getByID(id);

            if (prod) {
                let updated = new Product(newProd.title, newProd.price, newProd.thumbnail, newProd.stock, id);
                await this.collection.findOneAndUpdate({ _id: prod._id }, updated);
            }
        } catch (err) {
            return { error: "No se encontró el product" }
        }

    }


    ///Elimino un producto por ID
    async deleteById(id) {
        try {
            let content = await this.getAll();
            //Busco el index del id, y si existe lo elimino del array
            const index = content.findIndex(prod => prod.id == id);
            if (index != -1) {
                await this.collection.deleteOne({ id: id })
            }
        } catch {
            return { error: "No se pudo eliminar el product" }
        }
    }

    ////Elimino todos los elementos del archivo
    async deleteAll() {
        try {
            await this.collection.deleteMany({});
        } catch (err) {
            return { error: "Error al eliminar los productos", err }
        }
    }


    async stockState(idProd, quantity) {
        let prod = await this.getByID(idProd);
        let stock = prod.stock - quantity;
        if (stock >= 0) {
            return true;
        } else {
            return false;
        }
    }

    async stockUpdate(idProd, quantity) {
        let prod = await this.getByID(idProd);
        let stock = await prod.stock - quantity;
        let content = await this.getAll();
        let index = content.findIndex(p => p.id == idProd);
        if ((stock >= 0) && (index != -1)) {
            prod.stock = stock;
        }
        await this.editByID(idProd, prod);
    }
}

