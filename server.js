import { routerCart } from './routes/routesCart.js';
import { routerProd } from './routes/routesProduct.js';
import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();


const PORT = process.env.LOCAL_PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/api/products', routerProd);
app.use('/api/cart', routerCart);




const server = app.listen(PORT, () => {
    console.log(`Servidor HTTP Escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en el servidor ${error}`))
