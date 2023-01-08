import * as fs from 'fs';
import { logger } from "../../../logger_config.js"

let instance = null;


export class ProdContainer {
    constructor(fileName) {
        this.name = fileName;
        this.fileRoute = "./public/" + this.name + ".txt";
    }

    static getContainer(fileName) {
        if (!instance) {
            instance = new ProdContainer(fileName);
        }
        return instance;
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

    ////Agrego producto al array
    async save(product) {
        try {
            const content = await this.getAll();
            //Defino el valor del id en base al contenido del archivo
            let lastId = 1;
            if (content.length > 0) {
                lastId = content[content.length - 1].id + 1;
            }
            let newProduct = { ...product, id: lastId };
            //agrego el producto al array y lo escribo en el archivo
            content.push(newProduct);
            await this.write(content);
            //devuelvo el último id o null
            if (lastId == -1) { lastId = null }
            return lastId;
        } catch (err) {
            logger.log("error", `Error al modificar el archivo ${err}`);
        }
    }

    ////Devuelvo un  producto por el ID
    async getByID(id) {
        //traigo el array y lo filtro por ID
        let content = await this.getAll();
        const prod = content.find(prod => prod.id == id);
        if (prod) {
            return prod;
        } else {
            return null;
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
                let updated = { ...newProd, id: id }
                let products = await this.getAll();
                let index = products.findIndex(p => p.id == id)
                products.splice(index, 1, updated);
                await this.write(products);
            }
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
                let prod = content.splice(index, 1);
                await this.write(content);
                return prod
            } else {
                return null;
            }
        } catch {
            logger.log("error", `No se pudo eliminar el producto ${err}`);
        }
    }

    ////Elimino todos los elementos del archivo
    async deleteAll() {
        try {
            //Reemplazo el contenido del archivo con un array vacío
            let content = [];
            await this.write(content);
        } catch (err) {
            logger.log("error", `Error al eliminar los productos ${err}`);
        }
    }


    async stockState(idProd, quantity) {
        let prod = await this.getByID(idProd);
        console.log(prod)
        let stock = prod.stock - quantity;
        if (stock >= 0) {
            return true;
        } else {
            return false;
        }
    }

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

