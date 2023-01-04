import Router from 'express';
import { isLoggedIn, isAdmin } from '../utils/middlewares.js';
import {
    getUsrOrders,
    getOrder,
    confirmOrder,
    cancelOrder
} from '../controllers/orderController.js'

export const routerOrder = Router();

routerOrder.get('/:email', isLoggedIn, getUsrOrders);
routerOrder.get('/:id', isLoggedIn, getOrder);
routerOrder.put('/:id/confirm', isLoggedIn, isAdmin, confirmOrder);
routerOrder.put('/:id/cancel', isLoggedIn, isAdmin, cancelOrder);

