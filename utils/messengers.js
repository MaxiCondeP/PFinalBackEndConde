import twilio from "twilio";
import { logger } from "../logger_config.js"
import {config} from '../config.js';


const accountSid = 'ACb4939bdb8272d3b876d55af9d0c6c853';
const authToken = 'bae90f19fda9a9d6a658e4fdf12b0b4a';
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