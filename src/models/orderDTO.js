export class Order {
    constructor(usr, products) {
        this.timestamp = Date.now().toString();
        this.usr=usr.username;
        this.products = products;
        this.state = "generada"
    }
}
