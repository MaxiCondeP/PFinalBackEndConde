export class Product {
    constructor(name, price, thumb, stock) {
        this.title = name;
        this.price = price;
        this.thumbnail = thumb;
        this.timestamp = Date.now();
        this.stock = stock
    }
}