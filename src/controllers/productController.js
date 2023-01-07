import { daoProducts } from '../../server.js'
import { logger } from "../../logger_config.js"


//Trae un prod por id  o todos si no hay param
export const getProducts = async (req, res) => {
    let id = req.params.id;
    if (id) {
        let prod = await daoProducts.getByID(id);
        logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
        if(prod){
            res.status(200).send(prod);
        }else{
            res.status(200).json("Producto no encontrado")
        }

    } else {
        let prods = await daoProducts.getAll();
        if(prods.length>0){
            res.status(200).send(prods);
        }else{
            res.status(200).send('No se encontraron productos')
        }
        logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    }
}

//Agrega un producto y dev el id
export const newProduct = async (req, res) => {
    let id = await daoProducts.save(req.body);
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    if(!isNaN(id)){
        res.status(200).send(`Producto creado!`);
    }else{
        res.status(500).send(`No se pudo crear el producto`);
    }
}

//Modifica un producto con su id
export const updateProduct = async (req, res) => {
    let id = req.params.id;
    await daoProducts.editByID(id, req.body);
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    res.status(200).send(`Product updated.`);
}

//Elimina un producto por id
export const deleteProduct=  async (req, res) => {
    let id = req.params.id;
    await daoProducts.deleteById(id);
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    res.status(200).send(`Product deleted.`);
}