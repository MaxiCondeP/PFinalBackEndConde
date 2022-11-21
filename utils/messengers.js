import twilio from "twilio";
import { logger } from "../logger_config.js"
import {config} from '../config.js';


const accountSid =config.admin_data.admin_accountSid;
const authToken =config.admin_data.admin_authToken;
const sender =config.admin_data.admin_phone;

const client = twilio(accountSid, authToken);


export const getOrderSMS = async (usrPhone, usrName) => {
    try {
        const message = await client.messages.create({
            body: `Sr. ${usrName}, su pedido fue recibido y está en proceso`,
            from: sender,
            to: usrPhone
        });
        logger.log("info", `SMS sent ${message}`);
    } catch (err) {
        logger.log("error", `SMS error ${err}`);
    }
}

export const getOrderWhatsapp = async (usrName) => {
    try {
        const message = await client.messages.create({
            body:`Nuevo pedido de ${usrName}`,
            from: "whatsapp:" + sender,
            to: "whatsapp:" + sender
        });
        logger.log("info", `Whatsapp sent ${message}`);
    } catch (err) {
        logger.log("error", `Whatsapp error ${err}`);
    }
}