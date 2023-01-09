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
routerCart.get('/:id/productos', authJWT, getProductsOnCart);
routerCart.post('/:id/productos', authJWT, addProductToCart);
routerCart.post('/:id/orden', authJWT, generateOrder);
routerCart.delete('/:id/productos/:id_prod', authJWT, deleteProductFromCart);