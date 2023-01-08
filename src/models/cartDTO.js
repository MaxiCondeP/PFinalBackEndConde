export class Cart {
    constructor(username) {
        this.timestamp = Date.now().toString()
        this.username= username;
        this.products = [];
    }
}
