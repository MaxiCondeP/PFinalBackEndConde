import Router from 'express';
import { isLoggedIn } from '../utils/middlewares.js';
import {
    newCart,
    deleteCart,
    getProductsOnCart,
    addProductToCart,
    generateOrder,
    deleteProductFromCart
} from '../controllers/cartController.js'

export const routerCart = Router();

routerCart.post('/', isLoggedIn, newCart);
routerCart.delete('/:id', isLoggedIn, deleteCart);
routerCart.get('/:id/products', isLoggedIn, getProductsOnCart);
routerCart.post('/:id/products', isLoggedIn, addProductToCart);
routerCart.get('/:id/order', isLoggedIn, generateOrder);
routerCart.delete('/:id/products/:id_prod', isLoggedIn, deleteProductFromCart);