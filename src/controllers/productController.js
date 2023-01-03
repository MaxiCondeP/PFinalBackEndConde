import { daoProducts } from '../../server.js'


//Trae un prod por id  o todos si no hay param
export const getProducts = async (req, res) => {
    let id = req.params.id;
    if (id) {
        let prod = await daoProducts.getByID(id);
        logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
        res.status(200).send(prod);

    } else {
        let prods = await daoProducts.getAll();
        logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
        res.status(200).send(prods)
    }
}

//Agrega un producto y dev el id
export const newProduct = async (req, res) => {
    let id = await daoProducts.save(req.body);
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    res.status(200).send(`Product created!`);
    
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