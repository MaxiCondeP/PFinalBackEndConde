

export class Cart {
    constructor() {
        this.timestamp = Date.now();
        this.products = [];
    }
}

export class CartContainer {

    constructor() {
        this.carts = [];
    }


    ///Devuelvo el array.
    getAll() {
        return this.carts;
    }


    ////Agrego producto al array
    async addCart() {
        //Defino el valor del id en base al contenido del array
        let lastId = 1;
        if (this.carts.length > 0) {
            lastId = this.carts[this.carts.length - 1].id + 1;
        }
        let cart = new Cart();
        let newCart = { ...cart, id: lastId };
        //agrego el producto al array 
        this.carts.push(newCart);
        return lastId;
    }

    ////Se elimina carrito
    delete(id) {
        const content = this.carts;
        const index = content.findIndex(cart => cart.id == id);
        if (index != -1) {
            content.splice(index, 1);
            this.carts = content;
        }
    }


    getByID(id) {
        //traigo el array y lo filtro por ID
        let content = this.carts;
        const cart = content.find(c => c.id == id);
        if (cart) {
            return cart;
        } else {
            return { error: "No se encontró el carrito" }
        }
    }

    getProducts(id) {
        let cart = this.getByID(id);
        if (cart) {
            return (cart.products);
        } else {
            return (cart);
        }
    }


    //Actualizo la lista de prods de un carrito por id. 
    updateCart(id, prod) {
        let cart = this.getByID(id);
        let content = this.carts;
        const index = content.findIndex(c => c.id == id);
        if (cart) {
            cart.products = prod;
            content[index] = cart;
            this.carts = content;
        }
    }

    isInCart(idCart) {
        let cart = this.getByID(idCart);
        if (prod) {
            return true
        } else {
            return false;
        }
    }


    ////Agrego prod al carrito
    AddToCart(idCart, prod, qua) {
        let cart = this.getByID(idCart);
        let index = cart.products.findIndex(p => p.id == prod.id);
        if (index == -1) {
            let newProd = { ...prod, quantity: qua }
            newProd.stock = newProd.stock - qua;
            cart.products.push(newProd);
        } else {
            cart.products[index].stock = cart.products[index].stock - qua;
            cart.products[index].quantity = cart.products[index].quantity + qua;
        }
        this.updateCart(idCart, cart.products);
    }


    //Elimino prod de carrito 
    async removeFromCart(idCart, idProd) {
        let cart = this.getByID(idCart);
        const index = cart.products.findIndex(p => p.id == idProd);
        if (index != -1) {
            let deletedProd = cart.products[index]
            cart.products.splice(index, 1)
            this.updateCart(idCart, cart.products);
            return deletedProd;
        } else {
            return { error: "Error , no se encontró el producto a eliminar", err }
        }
    }

}
