export class Cart {
    constructor() {
        this.timestamp = Date.now().toISOString();
        this.products = [];
    }
}
