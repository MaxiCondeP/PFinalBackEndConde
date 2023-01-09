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
            res.status(200).send('Producto no encontrado')
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

export const getByCategory=async(req,res)=>{
    let category = req.params.category;
    let products = await daoProducts.getByCategory(category);
        logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
        if(products){
            res.status(200).send(products);
        }else{
            res.status(200).send(`No hay productos de la categoría: ${category}`)
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
    let prod= await daoProducts.editByID(id, req.body);
    if(prod){
        res.status(200).send(`Producto id:${id} editado.`);
    }else{
        res.status(200).send(`No se pudo editar el producto`);
    }
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
   
}

//Elimina un producto por id
export const deleteProduct=  async (req, res) => {
    let id = req.params.id;
    let prod= await daoProducts.deleteById(id);
    if(prod){
        res.status(200).send(`Producto id:${id} eliminado.`);
    }else{
        res.status(200).send(`No se pudo eliminar el producto`);
    }
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
}