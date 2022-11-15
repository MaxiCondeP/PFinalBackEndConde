import Router from 'express';
import { daoCart, daoProd } from '../daos/index.js'
import { getOrderMail } from '../utils/mailer.js';
import { getOrderSMS } from '../utils/messengers.js';

export const routerCart = Router();
//Crea un carrito y dev su id
routerCart.post('/', async (req, res) => {
    let id = daoCart.addCart();
    res.send(id);
});

//Elimina y vacia un carrito 
routerCart.delete('/:id', async (req, res) => {
    let id = req.params.id;
    let cart = await daoCart.getByID(id);
    ///recorro prods para actualizar stock 
    cart.products.map((product) => {
        let quantity = -product.quantity;
        daoProd.stockUpdate(product.id, quantity)
    });
    daoCart.delete(id);


});

//Devuelve productos de un carrito
routerCart.get('/:id/products', async (req, res) => {
    let id = req.params.id;
    console.log(id)
    res.send(await daoCart.getProducts(id));
});

/// Agrega producto a cart ***FALTA ARREGLAR STOCK DENTRO DE CADA PROD DEL CARRITO***
routerCart.post('/:id/products', async (req, res) => {
    let idCart = req.params.id;
    let idProd = req.body.id;
    let quantity = req.body.quantity;
    let prod = await daoProd.getByID(idProd);
    if (await daoProd.stockState(idProd, quantity)) {
        await daoCart.AddToCart(idCart, prod, quantity);
        await daoProd.stockUpdate(idProd, quantity)
    } else {
        res.send({ Error: 'Stock insuficiente para la compra solicitada' })
    }

});

///Finaliza orden, por ahora sólo se envía el mail
routerCart.get('/:id/order',async(req, res)=>{
    let products= await daoCart.getProducts(req.params.id);
    let user= req.session.user;
    await getOrderMail(user.name,products);
    await getOrderSMS(user.name, user.phone);

})
routerCart.delete('/:id/products/:id_prod', async (req, res) => {
    let idCart = req.params.id;
    let idProd = req.params.id_prod;
    ///traigo el eliminado y le  sumo cantidad a stock(-quantity)
    let prod = await daoCart.removeFromCart(idCart, idProd);
    let quantity = -prod.quantity;
    daoProd.stockUpdate(idProd, quantity)
});