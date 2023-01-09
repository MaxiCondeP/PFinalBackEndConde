import Router from 'express';
import { isAdmin } from '../utils/middlewares.js';
import { authJWT } from "../utils/auth.js";
import {badRoute} from '../controllers/usrController.js'
import {
    getUsrMessages,
    getMessages
} from '../controllers/messageController.js'

export const routerMessage = Router();

routerMessage.get('/', authJWT,isAdmin, getMessages);
routerMessage.get('/:email', authJWT, getUsrMessages);
routerMessage.get("*", badRoute);
routerMessage.put("*", badRoute);
routerMessage.post("*", badRoute);
routerMessage.delete("*", badRoute);