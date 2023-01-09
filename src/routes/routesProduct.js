import Router from "express";
import { isAdmin } from '../utils/middlewares.js';
import { authJWT } from "../utils/auth.js";
import {badRoute} from '../controllers/usrController.js'
import {
    getProducts,
    getByCategory,
    newProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js'

export const routerProd = Router();


routerProd.get('/:id?', authJWT,getProducts);
routerProd.get('/categoria/:category', authJWT,getByCategory);
routerProd.post('/', authJWT,  isAdmin, newProduct);
routerProd.put('/:id', authJWT, isAdmin, updateProduct);
routerProd.delete('/:id', authJWT, isAdmin, deleteProduct);
routerProd.get("*", badRoute);
routerProd.put("*", badRoute);
routerProd.post("*", badRoute);
routerProd.delete("*", badRoute);