export class Order {
    constructor(usr, products,address) {
        this.timestamp = Date.now().toString();
        this.usr=usr.username;
        this.products = products;
        this.state = "generada"
        this.address= usr.address;
    }
}
