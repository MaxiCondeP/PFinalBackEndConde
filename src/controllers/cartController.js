import { getOrderMail } from '../utils/mailer.js';
import { getOrderSMS } from '../utils/messengers.js';
import { daoProducts, daoCarts, daoOrders } from '../../server.js'


//Crea un carrito y dev su id
export const newCart = async (req, res) => {
    let id = await daoCarts.addCart();
    if (!isNaN(id)) {
        res.status(200).send(`Carrito id ${id} creado`);
    } else {
        res.status(200).send(`El carrito no pudo ser creado`);
    }

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
    prod = await daoCarts.delete(id);
    if (prod) {
        res.status(200).send(`Carrito id: ${id} eliminado.`);
    } else {
        res.status(200).send(`El carrito no pudo ser eliminado`);
    }


}

//Devuelve productos de un carrito
export const getProductsOnCart = async (req, res) => {
    let id = req.params.id;
    let products = await daoCarts.getProducts(id);
    if (products.length > 0) {
        res.status(200).send(products);
    } else {
        res.status(200).send('No hay productos en el carrito');
    }

}

/// Agrega producto a cart 
export const addProductToCart = async (req, res) => {
    let idCart = req.params.id;
    let idProd = req.body.idProduct;
    let quantity = req.body.quantity;
    let prod = await daoProducts.getByID(idProd);
    if(prod){
        if (await daoProducts.stockState(idProd, quantity)) {
            const result=await daoCarts.AddToCart(idCart, prod, quantity);
            await daoProducts.stockUpdate(idProd, quantity)
            if(!result.error){
                res.status(200).send(`Producto agregado al carrito.`);
            }else{
                res.status(200).send(`No se pudo agregar al carrito`);
            }
        } else {
            res.status(500).send('Stock insuficiente para la compra solicitada')
        }
    }else{
        res.status(200).send(`No se pudo agregar al carrito, producto no encontrado`);
    }
 
}

///Genera la orden, envía el mail y sms, y elimino el carrito
export const generateOrder = async (req, res) => {
    const idCart= req.params.id;
    let products = await daoCarts.getProducts(idCart);
    let user = req.session.usr;
    const order= await daoOrders.addOrder(user, products)
    await daoCarts.delete(idCart);
    await getOrderMail(user.name, products);
    await getOrderSMS(user.name, user.phone);
    if(order.id!=undefined){
        res.status(200).send(`La orden #${order.id} se ha creado correctamente en estado:- ${order.state}`);
    }else{
        res.status(200).send(`La orden no pudo ser generada`);
    }
    
}

//Elimina un  producto del carrito
export const deleteProductFromCart = async (req, res) => {
    let idCart = req.params.id;
    let idProd = req.params.id_prod;
    ///traigo el eliminado y le  sumo cantidad a stock(-quantity)
    let prod = await daoCarts.removeFromCart(idCart, idProd);
    if (prod) {
        let quantity = prod.quantity * -1;
        await daoProducts.stockUpdate(idProd, quantity)
        res.status(200).send(`Producto id: ${idProd} eliminado del carrito id: ${idCart}.`);
    } else {
        res.status(200).send(`El producto no pudo ser eliminado del carrito`)
    }


}