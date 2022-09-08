import Router  from "express";
import { isAdmin } from '../middlewares/middlewares.js'
import {daoProd} from '../daos/index.js'

export const routerProd = Router();
//Trae un prod por id  o todos si no hay param
routerProd.get('/:id?', async (req, res) => {
    let id = req.params.id;
    if (id) {
        let prod = await daoProd.getByID(id);
        res.send(prod);

    } else {
        let prods = await daoProd.getAll();
        res.send(prods)
    }
});

//Agrega un producto y dev el id
routerProd.post('/', isAdmin, async (req, res) => {
    let id = daoProd.save(req.body);
    res.send(id);
});

//Modifica un producto con su id
routerProd.put('/:id', isAdmin, async (req, res) => {
    let id = req.params.id;
    daoProd.editByID(id, req.body);
    res.send("ok");
});

//Elimina un producto por id
routerProd.delete('/:id', isAdmin, async (req, res) => {
    let id = req.params.id;
    daoProd.deleteById(id);
});
