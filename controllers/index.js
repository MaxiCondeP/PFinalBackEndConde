import * as fs from 'fs';


///Creo la clase Producto
export class Product {
    constructor(name, price, thumb) {
        this.title = name;
        this.price = price;
        this.thumbnail = thumb;
    }
}
///creo la clase Contenedor

export class Contenedor {
    constructor(fileName) {
        this.name = fileName;
        this.fileRoute = "./" + this.name + ".txt";
    }

    ///Traigo el archivo y devuelvo el array.
    async getAll() {
        try {
            const content = await fs.promises.readFile(this.fileRoute, 'utf-8');
            return JSON.parse(content);
        }
        catch (err) {
            console.log("Error al leer el archivo", err)
        }
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
            console.log("Error al escribir el archivo", err)
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
            //muestro el último id
            console.log(`El último id es: ${lastId}`);
            return lastId;
        } catch (err) {
            console.log("Error al modificar el archivo", err)
        }
    }

    ////Devuelvo un  producto por el ID
    async getByID(id) {
        //traigo el array y lo filtro por ID
        let content = await this.getAll();
        const prod = content.find(prod => prod.id == id);
        if (prod) {
            //Muestro y devuelvo el producto
            console.log(prod);
            return prod;
        } else {
            console.log("No se encontró el producto.")
            return null;
        }
    }


    ///Elimino un producto por ID
    async deleteById(id) {
        let content = await this.getAll();
        //Busco el index del id, y si existe lo elimino del array
        const index = content.findIndex(prod => prod.id == id);
        if (index != -1) {
            content.splice(index, 1);
            await this.write(content);
        } else {
            console.log("No se encontró el producto");
        }
    }

    ////Elimino todos los elementos del archivo
    async deleteAll() {
        try {
            //Reemplazo el contenido del archivo con un array vacío
            let content = [];
            await this.write(content);
        } catch (err) {
            console.log("Error al eliminar el archivo", err);
        }
    }
    ///7Devuelvo un producto random
    async getRandom() {
        let productos = await this.getAll();
        let aleatorio = Math.floor(Math.random() * (productos.length));
        let producto = productos[aleatorio];
        console.log(producto);
        return producto;
    }
    
}


