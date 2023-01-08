import { daoOrders, daoProducts } from '../../server.js'
import { getOrderMailToUsr } from '../utils/mailer.js';
import { logger } from "../../logger_config.js"



//Traigo órdenes por user
export const getUsrOrders = async (req, res) => {
    let user = req.params.email;
    let orders = await daoOrders.getByUsr(user)
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    if (orders) {
        res.status(200).send(orders);
    } else {
        res.status(200).send('No se encontraron órdenes');
    }

}

//Traigo una órden por id
export const getOrder = async (req, res) => {
    let id = req.params.id;
    let order = await daoOrders.getByID(id);
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    if (order) {
        res.status(200).send(order);
    } else {
        res.status(200).send('No se encontraron órdenes');
    }
}

//Cambio state de orden a confirmada
export const confirmOrder = async (req, res) => {
    let id = req.params.id;
    let user = req.session.usr;
    const result = await daoOrders.changeState(id, "confirmada");
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    if (result) {
        //si esta ok traigo datos de la orden para enviar mail de confirmación
        const order = await daoOrders.getByID(id);
        await getOrderMailToUsr(order);
        res.status(200).send(`Orden confirmada`);
    } else {
        res.status(200).send(`Orden inexistente o en estado no modificable.`);
    }

}

//Cambio state de orden a cancelada
export const cancelOrder = async (req, res) => {
    let id = req.params.id;
    let user = req.session.user;
    const result = await daoOrders.changeState(id, "cancelada");
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    if (result) {
        //si esta ok traigo datos de la orden 
        const order = await daoOrders.getByID(id);
        const products= order.products;
        let quantity=0;
        //recorro prods para devolver a stock 
        for(let i=0; i<products.length ;i++){
            quantity = -products[i].quantity;
            await daoProducts.stockUpdate(products[i].id, quantity);
        }
        await getOrderMailToUsr(order);
        res.status(200).send(`Orden cancelada`);
    } else {
        res.status(200).send(`Orden inexistente o en estado no modificable.`);
    }

}