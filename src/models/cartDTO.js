export class Cart {
    constructor(username, address) {
        this.timestamp = Date.now().toString()
        this.username= username;
        this.products = [];
        this.address= address;
    }
}
