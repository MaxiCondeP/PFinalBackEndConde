import Router from 'express';
import { isAdmin } from '../utils/middlewares.js';
import { authJWT } from "../utils/auth.js";
import {badRoute} from '../controllers/usrController.js'
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
routerOrder.put('/:id/confirm', authJWT, isAdmin, confirmOrder);
routerOrder.put('/:id/cancel', authJWT, isAdmin, cancelOrder);
routerOrder.get("*", badRoute);
routerOrder.put("*", badRoute);
routerOrder.post("*", badRoute);
routerOrder.delete("*", badRoute);

