export class Product {
    constructor(name, price, thumb, stock, id, category) {
        this.title = name;
        this.price = price;
        this.thumbnail = thumb;
        this.timestamp = Date.now();
        this.stock = stock;
        this.id = id;
        this.category = category;
    }
}