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

routerOrder.get('/manager/:email', authJWT, isAdmin, getUsrOrders);
routerOrder.get('/', authJWT, getUsrOrders);
routerOrder.get('/:id', authJWT, getOrder);
routerOrder.post('/:id/confirm', authJWT, isAdmin, confirmOrder);
routerOrder.post('/:id/cancel', authJWT, isAdmin, cancelOrder);

