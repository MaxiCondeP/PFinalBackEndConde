import {productModel} from "../models/modelsMongodb.js"


///Creo la clase Producto
export class Product {
    constructor(name, price, thumb, stock, id) {
        this.title = name;
        this.price = price;
        this.thumbnail = thumb;
        this.timestamp = Date.now();
        this.stock = stock
        this.id= id
    }

}
///creo la clase Contenedor

export class mongoProductContainer {
    constructor() {
        this.collection = productModel;
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
    async save(product) {
        try {
            const content = await this.getAll();
            //Defino el valor del id en base al contenido del archivo
            let lastId = 1;
            if (content.length > 0) {
                lastId = content[content.length - 1].id + 1;
            }
            let newProduct = new Product(product.title, product.price,product.thumbnail,product.stock, lastId)
            //agrego el producto a la mongo
            const newElement = new this.collection(newProduct);
            await newElement.save();
            //muestro el último id
            console.log(`El último id es: ${lastId}`);
            return lastId;
        } catch (err) {
            console.log("Error al modificar el archivo", err);
            return { error: "Error al modificar el archivo", err }
        }
    }

    ////Devuelvo un  producto por el ID
    async getByID(id) {
        try {
            let prod = await this.collection.findOne({ id: id });
          
            return prod;
        } catch (err) {
            console.log("No se encontró el product", err)
            return { error: "No se encontró el product" }
        }
    }

    async editByID(id, newProd) {
        try {
            let prod = await this.getByID(id);

            if (prod) {
                let updated = new Product(newProd.title, newProd.price,newProd.thumbnail,newProd.stock, id);
                await this.collection.findOneAndUpdate({_id: prod._id},updated);
            }
        } catch(err) {
            console.log("No se encontró el product", err)
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
                await this.collection.deleteOne({id: id})
            }
        } catch {
            console.log("No se pudo eliminar el product", err)
            return { error: "No se pudo eliminar el product" }
        }
    }

    ////Elimino todos los elementos del archivo
    async deleteAll() {
        try {
            await this.collection.deleteMany({});
        } catch (err) {
            console.log("Error al eliminar los productos", err )
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

