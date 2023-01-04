export class Order {
    constructor(usr, products) {
        this.timestamp = Date.now().toISOString();
        this.usr;
        this.products = [];
        this.state = "generated"
    }
}
