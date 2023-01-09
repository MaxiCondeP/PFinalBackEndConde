import { productModel } from "../../models/modelsMongodb.js"
import { Product } from '../../models/productDTO.js'
import { logger } from "../../../logger_config.js"


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
            logger.log("error", `Error al traer datos de la base ${err}`);
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
            logger.log("error", `Error al guardar el producto ${err}`);
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
            logger.log("error", `No se encontró el el producto ${err}`);
        }
    }

    async getByCategory(category) {
        //traigo el array y lo filtro por ID
        let content = await this.getAll();
        const prod = content.filter(prod => prod.category == category);
        if (prod.length>0) {
            return prod;
        } else {
            return null;
        }
    }

    async editByID(id, newProd) {
        try {
            let prod = await this.getByID(id);
            if (prod) {
                let updated = new Product(newProd.title, newProd.price, newProd.thumbnail, newProd.stock, id);
                await this.collection.findOneAndUpdate({ _id: prod._id }, updated);
            }
            return prod;
        } catch (err) {
            logger.log("error", `No se pudo modificar el el producto ${err}`);
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
                return content[index];
            }else{
                return null;
            }
        } catch {
            logger.log("error", `No se pudo eliminar el producto ${err}`);
        }
    }

    ////Elimino todos los elementos del archivo
    async deleteAll() {
        try {
            await this.collection.deleteMany({});
        } catch (err) {
            logger.log("error", `Error al eliminar los productos ${err}`);
        }
    }

    ////verifico si es posible la compra en cuanto a stock
    async stockState(idProd, quantity) {
        let prod = await this.getByID(idProd);
        let stock = prod.stock - quantity;
        if (stock >= 0) {
            return true;
        } else {
            return false;
        }
    }


    ////actualizo stock
    async stockUpdate(idProd, quantity) {
        let prod = await this.getByID(idProd);
        let stock = prod.stock - quantity;
        let content = await this.getAll();
        let index = content.findIndex(p => p.id == idProd);
        if ((stock >= 0) && (index != -1)) {
            prod.stock = stock;
        }
        await this.editByID(idProd, prod);
    }
}

