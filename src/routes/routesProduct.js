import Router from "express";
import { isAdmin, isLoggedIn } from '../utils/middlewares.js';
import {
    getProducts,
    newProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js'

export const routerProd = Router();


routerProd.get('/:id?', isLoggedIn, getProducts);
routerProd.post('/', isLoggedIn, isAdmin, newProduct);
routerProd.put('/:id', isLoggedIn, isAdmin, updateProduct);
routerProd.delete('/:id', isLoggedIn, isAdmin, deleteProduct);
