import { createTransport } from "nodemailer";
import { logger } from "../../logger_config.js"
import { getProductsHTML } from "./utils.js";
import {config} from '../../config.js';

const TEST_MAIL = config.admin_data.admin_email;
const PASS_MAIL = config.admin_data.admin_pass_email;

const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: TEST_MAIL,
        pass: PASS_MAIL
    }
});

export const getSignupMail = async (user) => {
    const mailOptions = {
        from: 'eccommerce API',
        to: TEST_MAIL,
        subject: 'Nuevo registro',
        html: `<h1>Nuevo registro</h1><br>
        <p><span style="font-style:italic;">Nombre: </span>${user.name}</p><br>
        <p><span style="font-style:italic;">Email: </span>${user.username}</p><br>
        <p><span style="font-style:italic;">Celular: </span>${user.phone}</p><br>
        <p><span style="font-style:italic;">Edad: </span>${user.age}</p>`
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        logger.log("info", `Mail sent ${info.response}`);
    } catch (err) {
        logger.log("error", `Mail error ${err}`);
    }
}


export const getOrderMail = async (usrName, products) => {

    let html=getProductsHTML(products);
    const mailOptions = {
        from: 'eccommerce API',
        to: TEST_MAIL,
        subject: `Nuevo pedido de ${usrName}`,
        html: html
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        logger.log("info", `Mail sent ${info.response}`);
    } catch (err) {
        logger.log("error", `Mail error ${err}`);
    }
}

export const getOrderMailToUsr = async (order) => {
    
    let mailSubject= `La orden nro ${order.id}, fue generada`;
    if(order.state=="confirmada"){
        mailSubject=`Confirmación de orden nro ${order.id}`
    }else if(order.state=="cancelada"){
        mailSubject= `La orden nro ${order.id} fue cancelada`
    }
 

    let html=getProductsHTML(order.products);
    const mailOptions = {
        from: 'eccommerce API',
        to: order.usr,
        subject: mailSubject ,
        html: html
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        logger.log("info", `Mail sent ${info.response}`);
    } catch (err) {
        logger.log("error", `Mail error ${err}`);
    }
}
