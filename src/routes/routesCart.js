import Router from 'express';
import { authJWT } from "../utils/auth.js";
import {
    newCart,
    deleteCart,
    getProductsOnCart,
    addProductToCart,
    generateOrder,
    deleteProductFromCart
} from '../controllers/cartController.js'

export const routerCart = Router();

routerCart.post('/', authJWT, newCart);
routerCart.delete('/:id', authJWT, deleteCart);
routerCart.get('/:id/products', authJWT, getProductsOnCart);
routerCart.post('/:id/products', authJWT, addProductToCart);
routerCart.get('/:id/order', authJWT, generateOrder);
routerCart.delete('/:id/products/:id_prod', authJWT, deleteProductFromCart);