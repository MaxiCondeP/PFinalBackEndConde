
import { config } from '../../../config.js';

let instance = null


export class firebaseProductContainer {
    constructor() {
        this.db = config.firebase.db;
        this.query = this.db.collection('products');
    }

    static getContainer() {
        if (!instance) {
            instance = new firebaseProductContainer();
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
            let newProduct = { ...product, id: lastId };
            //agrego el producto a la bd
            let doc = this.query.doc(`${lastId}`);
            await doc.create(newProduct);
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
            const doc = this.query.doc(`${id}`);
            const element = await doc.get();
            let prod = element.data();
            if (prod) {
                return prod;
            } else {
                return null;
            }
        } catch (err) {
            return { error: "No se encontró el product" , err}
        }
    }

    async editByID(id, newProd) {
        try {
            let prod = await this.getByID(id);
            if (prod) {
                let updated = { ...newProd, id: id }
                const doc = this.query.doc(`${id}`);
                console.log(await doc.update(updated))
            }
        } catch (err) {
            return { error: "No se encontró el product", err }
        }

    }


    ///Elimino un producto por ID
    async deleteById(id) {
        try {
            let content = await this.getAll();
            //Busco el index del id, y si existe lo elimino del array
            const index = content.findIndex(prod => prod.id == id);
            if (index != -1) {
                await this.query.doc(`${id}`).delete();
            }
        } catch {
            return { error: "No se pudo eliminar el product" }
        }
    }

    ////Elimino todos los elementos de la coleccion
    async deleteAll() {
        try {
            const snapshot = await this.query.get();

            const batchSize = snapshot.size;
            if (batchSize === 0) {
                // Valida que no queden documentos
                resolve();
                return;
            }

            //Elimina documentos
            const batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();


            process.nextTick(() => {
                deleteQueryBatch(db, query, resolve);
            });
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
        let stock = prod.stock - quantity;
        let content = await this.getAll();
        let index = content.findIndex(p => p.id == idProd);
        if ((stock >= 0) && (index != -1)) {
            prod.stock = stock;
        }
        await this.editByID(idProd, prod);
    }
}

