import Router from 'express';
import { isAdmin } from '../utils/middlewares.js';
import { authJWT } from "../utils/auth.js";
import {
    getUsrOrders,
    getOrder,
    confirmOrder,
    cancelOrder
} from '../controllers/orderController.js'

export const routerOrder = Router();

routerOrder.get('/:email', authJWT, getUsrOrders);
routerOrder.get('/:id', authJWT, getOrder);
routerOrder.put('/:id/confirm', authJWT, isAdmin, confirmOrder);
routerOrder.put('/:id/cancel', authJWT, isAdmin, cancelOrder);

