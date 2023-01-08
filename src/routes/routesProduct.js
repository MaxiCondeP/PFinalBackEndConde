import Router from "express";
import { isAdmin, isLoggedIn } from '../utils/middlewares.js';
import { authJWT } from "../utils/auth.js";
import {
    getProducts,
    getByCategory,
    newProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js'

export const routerProd = Router();


routerProd.get('/:id?', authJWT,getProducts);
routerProd.get('/category/:category', authJWT,getByCategory);
routerProd.post('/', authJWT,  isAdmin, newProduct);
routerProd.put('/:id', authJWT, isAdmin, updateProduct);
routerProd.delete('/:id', authJWT, isAdmin, deleteProduct);
