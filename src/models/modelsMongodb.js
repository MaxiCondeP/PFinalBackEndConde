import mongoose from "mongoose";
import { config } from '../../config.js';

try {
    mongoose.connect(config.mongo.uri, config.mongo.options);
} catch (error) {
    console.log(error);
};

const schemaCart = new mongoose.Schema({
    id: { type: Number, required: true },
    username: { type: String, required: true },
    timestamp: { type: Number, required: true },
    products: { type: Array, required: true },
});

const schemaProduct = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true, max: 100 },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true, max: 400 },
    timestamp: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String },
    quantity:{type: Number}
});

const schemaUsr = new mongoose.Schema({
    name: { type: String, required: true, max: 400 },
    username: { type: String, required: true, max: 400 },
    password: { type: String, required: true, max: 400 },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    avatar: { type: String, required: true, max: 400 },
    isAdmin:{type: Boolean}
});

const schemaMessage = new mongoose.Schema({
    author: {
        email: { type: String, required: true },
        name: { type: String, max: 100 },
        lastname: { type: String, max: 100 },
        age: { type: Number, max: 100 },
        alias: { type: String, max: 100 },
        avatar: { type: String, }
    },
    text: { type: String, required: true },
    date: { type: String, max: 100 }
});


const schemaOrder = new mongoose.Schema({
    id: { type: Number, required: true },
    timestamp: { type: Number, required: true },
    usr: { type: String, required: true },
    products:  { type: Array, required: true },
    state: { type: String, required: true }
});

export const cartModel = mongoose.model('carts', schemaCart);
export const productModel = mongoose.model('products', schemaProduct);
export const usrModel = mongoose.model('users', schemaUsr);
export const msgModel = mongoose.model('messages', schemaMessage);
export const orderModel = mongoose.model('orders', schemaOrder);