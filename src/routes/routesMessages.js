import Router from 'express';
import { isAdmin } from '../utils/middlewares.js';
import { authJWT } from "../utils/auth.js";
import {
    getUsrMessages,
    getMessages
} from '../controllers/messageController.js'

export const routerMessage = Router();

routerMessage.get('/', authJWT, getMessages);
routerMessage.get('/:email', authJWT, getUsrMessages);