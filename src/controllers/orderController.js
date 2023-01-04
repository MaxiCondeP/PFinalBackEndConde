import { daoProducts, daoCarts, daoOrders } from '../../server.js'
import { getOrderMailToUsr } from '../utils/mailer.js';



export const getUsrOrders = async (req, res) => {
    let user = req.session.user;
    let orders = daoOrders.getByUsr(user.id)
    res.status(200).send(orders);
}

export const getOrder = async (req, res) => {
    let id = req.params.id;
    let order = await daoOrders.getByID(id);
    res.status(200).send(order);
}

export const confirmOrder = async (req, res) => {
    let id = req.params.id;
    let user = req.session.user;
    await daoOrders.changeState(id, "confirmada");
    const order = await daoOrders.getByID(id);
    await getOrderMailToUsr(user, order);
    res.status(200).send(`Order confirmed`);
}

export const cancelOrder = async (req, res) => {
    let id = req.params.id;
    let user = req.session.user;
    await daoOrders.changeState(id, "cancelada");
    const order = await daoOrders.getByID(id);
    await getOrderMailToUsr(user, order);
    res.status(200).send(`Order canceled`);
}