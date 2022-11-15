import mongoose from "mongoose";
import {config} from '../config.js';

try {
    mongoose.connect(config.mongo.uri, config.mongo.options);
} catch (error) {
    console.log(error);
};

 const schemaCart = new mongoose.Schema({
    id: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    products: { type: Array, required: true },
});

 const schemaProduct = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true, max: 100 },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true, max: 400 },
    timestamp: { type: Number, required: true },
    stock: { type: Number, required: true }
});

const schemaUsr = new mongoose.Schema({
    name: { type: String, required: true, max: 400 },
    username: { type: String, required: true, max: 400 },
    password: { type: String, required: true, max: 400 },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    avatar: { type: String, required: true, max: 400 },
});

export  const cartModel= mongoose.model('carts', schemaCart);
export const productModel= mongoose.model('products', schemaProduct);
export const usrModel= mongoose.model('users', schemaUsr);