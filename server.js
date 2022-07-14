import { Contenedor, Product } from './controllers/index.js'
import express from 'express';
const app = express();

const PORT = process.env.PORT || 3000;

////Instancia de clase
const archivo = new Contenedor("productos");

app.get('/', (req, res) => {
    try {
        res.send(`<h1>Bienvenidos al servidor express</h1>`)
    } catch (error) {
        console.log(error);
    }
});

app.get('/Productos', async (req, res)=>{
    try{
        let productos = await archivo.getAll();
        res.send(console.log(productos))
    }catch(error){
        console.log(error);
    }
})

app.get("/ProductoRandom", async (req, res) => {
    try {
        res.send(await archivo.getRandom());
    } catch (error) {
        console.log(error);
    }
});







const server = app.listen(PORT, () => { 
    console.log(`Servidor HTTP Escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en el servidor ${error}`))





