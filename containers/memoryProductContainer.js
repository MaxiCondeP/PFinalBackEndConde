

///Creo la clase Producto
export class Product {
    constructor(name, price, thumb, stock) {
        this.title = name;
        this.price = price;
        this.thumbnail = thumb;
        this.timestamp = Date.now();
        this.stock = stock
    }
}
///creo la clase Contenedor

export class ProdContainer {
    constructor() {
        this.products = [];
    }

    ///Traigo el archivo y devuelvo el array.
    getAll() {
        return this.products;
    }


    ////Agrego producto al array
    save(product) {
        const content = this.getAll();
        //Defino el valor del id en base al contenido del archivo
        let lastId = 1;
        if (content.length > 0) {
            lastId = content[content.length - 1].id + 1;
        }
        let newProduct = { ...product, id: lastId };
        //agrego el producto al array y lo escribo en el archivo
        content.push(newProduct);
        this.products = content;
        //muestro el último id
        console.log(`El último id es: ${lastId}`);
        return lastId;

    }

    ////Devuelvo un  producto por el ID
    getByID(id) {
        //traigo el array y lo filtro por ID
        let content = this.getAll();
        const prod = content.find(prod => prod.id == id);
        if (prod) {
            //Muestro y devuelvo el producto
            console.log(prod);
            return prod;
        } else {
            return { error: "No se encontró el producto" }
        }
    }

    editByID(id, newProd) {
        let prod = this.getByID(id);
        if (prod) {
            let updated = { ...newProd, id: id }
            let products = this.getAll();
            let index = products.findIndex(p => p.id == id)
            this.products.splice(index, 1, updated);
        }

    }


    ///Elimino un producto por ID
    deleteById(id) {
        let content = this.getAll();
        //Busco el index del id, y si existe lo elimino del array
        const index = content.findIndex(prod => prod.id == id);
        if (index != -1) {
            content.splice(index, 1);
            this.products = content;
        } else {
            return { error: "No se encontró el producto" }
        }
    }

    ////Elimino todos los elementos del archivo
    deleteAll() {
        //Reemplazo el contenido del archivo con un array vacío
        this.products = [];
    }


    stockState(idProd, quantity) {
        let prod = this.getByID(idProd);
        let stock = prod.stock - quantity;
        if (stock >= 0) {
            return true;
        } else {
            return false;
        }
    }

    stockUpdate(idProd, quantity) {
        let prod = this.getByID(idProd);
        let stock = prod.stock - quantity;
        let content = this.getAll();
        let index = content.findIndex(p => p.id == idProd);
        if ((stock >= 0) && (index != -1)) {
            prod.stock = stock;
        }
        this.editByID(idProd, prod);
    }
}

