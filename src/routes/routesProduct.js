import Router  from "express";
import { isAdmin } from '../utils/middlewares.js';
import{getProducts,
    newProduct,
    updateProduct,
    deleteProduct
    } from '../controllers/productController.js'

export const routerProd = Router();


routerProd.get('/:id?',getProducts);
routerProd.post('/', isAdmin, newProduct);
routerProd.put('/:id', isAdmin,updateProduct);
routerProd.delete('/:id', isAdmin, deleteProduct);
