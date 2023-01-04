import Router from 'express';
import { isLoggedIn, isAdmin } from '../utils/middlewares.js';
import {
    getUsrMessages,
    getMessages
} from '../controllers/messageController.js'

export const routerMessage = Router();

routerMessage.get('/', isLoggedIn, getMessages);
routerMessage.get('/:email', isLoggedIn, getUsrMessages);