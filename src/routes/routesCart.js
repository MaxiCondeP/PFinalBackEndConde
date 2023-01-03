import Router from 'express';
import {
    newCart,
    deleteCart,
    getProductsOnCart,
    addProductToCart,
    generateOrder,
    deleteProductFromCart
} from '../controllers/cartController.js'

export const routerCart = Router();

routerCart.post('/', newCart);
routerCart.delete('/:id',deleteCart);
routerCart.get('/:id/products',getProductsOnCart);
routerCart.post('/:id/products',addProductToCart);
routerCart.get('/:id/order', generateOrder);
routerCart.delete('/:id/products/:id_prod',deleteProductFromCart);