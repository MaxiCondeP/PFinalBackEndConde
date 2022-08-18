import { CartContainer, ProdContainer, Product } from './controllers/index.js'
import express from 'express';
import Router from 'express';
import { isAdmin } from './middlewares/middlewares.js'


const app = express();
const routerProd = Router();
const routerCart = Router();

const PORT = process.env.PORT || 3000;


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/api/products', routerProd);
app.use('/api/cart', routerCart);



////Instancia de clase
const archivoProd = new ProdContainer("productos");
const archivoCart = new CartContainer("carritos");

//Trae un prod por id  o todos si no hay param
routerProd.get('/:id?', async (req, res) => {
    let id = req.params.id;
    if (id) {
        let prod = await archivoProd.getByID(id);
        res.send(prod);

    } else {
        let prods = await archivoProd.getAll();
        res.send(prods)
    }
});

//Agrega un producto y dev el id
routerProd.post('/', isAdmin, async (req, res) => {
    let id = archivoProd.save(req.body);
    res.send(id);
});

//Modifica un producto con su id
routerProd.put('/:id', isAdmin, async (req, res) => {
    let id = req.params.id;
    archivoProd.editByID(id, req.body);
    res.send("ok");
});

//Elimina un producto por id
routerProd.delete('/:id', isAdmin, async (req, res) => {
    let id = req.params.id;
    archivoProd.deleteById(id);
});

////ROUTES CART

//Crea un carrito y dev su id
routerCart.post('/', async (req, res) => {
    let id = archivoCart.addCart();
    res.send(id);
});

//Elimina y vacia un carrito 
routerCart.delete('/:id', async (req, res) => {
    let id = req.params.id;
    let cart= await archivoCart.getByID(id);
    ///recorro prods para actualizar stock 
    cart.products.map((product)=>{
        let quantity= -product.quantity;
        archivoProd.stockUpdate(product.id,quantity )
    });
    archivoCart.delete(id);
    

});

//Devuelve productos de un carrito
routerCart.get('/:id/products', async (req, res) => {
    let id = req.params.id;
    res.send(await archivoCart.getProducts(id));
});

/// Agrega producto a cart ***FALTA ARREGLAR STOCK DENTRO DE CADA PROD DEL CARRITO***
routerCart.post('/:id/products', async (req, res) => {
    let idCart = req.params.id;
    let idProd = req.body.id;
    let quantity = req.body.quantity;
    if (await archivoProd.stockState(idProd, quantity)) {
        let prod = await archivoProd.getByID(idProd);
        archivoCart.AddToCart(idCart, prod, quantity);
        archivoProd.stockUpdate(idProd,quantity)
    }else{
        res.send({Error: 'Stock insuficiente para la compra solicitada'})
    }

});

routerCart.delete('/:id/products/:id_prod', async (req, res) => {
    let idCart = req.params.id;
    let idProd = req.params.id_prod;
    ///traigo el eliminado y le  sumo cantidad a stock(-quantity)
    let prod= await archivoCart.removeFromCart(idCart, idProd);
    let quantity= -prod.quantity;
    archivoProd.stockUpdate(idProd,quantity)
});



const server = app.listen(PORT, () => {
    console.log(`Servidor HTTP Escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en el servidor ${error}`))
