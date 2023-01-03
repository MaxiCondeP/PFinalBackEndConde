import { getOrderMail } from '../utils/mailer.js';
import { getOrderSMS } from '../utils/messengers.js';
import {daoProducts, daoCarts} from '../../server.js'


//Crea un carrito y dev su id
export const newCart = async (req, res) => {
    let id = daoCarts.addCart();
    res.send(id);
}

//Elimina y vacia un carrito 
export const deleteCart = async (req, res) => {
    let id = req.params.id;
    let cart = await daoCarts.getByID(id);
    ///recorro prods para actualizar stock 
    cart.products.map((product) => {
        let quantity = -product.quantity;
        daoProducts.stockUpdate(product.id, quantity)
    });
    await daoCarts.delete(id);
    res.status(200).send(`Product deleted from cart.`);

}

//Devuelve productos de un carrito
export const getProductsOnCart = async (req, res) => {
    let id = req.params.id;
    let products=await daoCarts.getProducts(id);
    res.status(200).send(products);
}

/// Agrega producto a cart ***FALTA ARREGLAR STOCK DENTRO DE CADA PROD DEL CARRITO***
export const addProductToCart = async (req, res) => {
    let idCart = req.params.id;
    let idProd = req.body.id;
    let quantity = req.body.quantity;
    let prod = await daoProducts.getByID(idProd);
    if (await daoProducts.stockState(idProd, quantity)) {
        await daoCarts.AddToCart(idCart, prod, quantity);
        await daoProducts.stockUpdate(idProd, quantity)
        res.status(200).send(`Products added to cart.`);
    } else {
        res.status(500).send({ Error: 'Stock insuficiente para la compra solicitada' })
    }
}

///Genera la orden, por ahora sólo se envía el mail
export const generateOrder = async (req, res) => {
    let products = await daoCarts.getProducts(req.params.id);
    let user = req.session.user;
    await getOrderMail(user.name, products);
    await getOrderSMS(user.name, user.phone);
    res.status(200).send(`Order generated.`)
}

//Elimina un  producto del carrito
export const deleteProductFromCart = async (req, res) => {
    let idCart = req.params.id;
    let idProd = req.params.id_prod;
    ///traigo el eliminado y le  sumo cantidad a stock(-quantity)
    let prod = await daoCarts.removeFromCart(idCart, idProd);
    let quantity = -prod.quantity;
    await daoProducts.stockUpdate(idProd, quantity)
    res.status(200).send(`Product deleted from cart.`)
}