import { daoMessages } from '../../server.js'
import { logger } from "../../logger_config.js"

//devuelvo mensajes por user(email)
export const getUsrMessages = async (req, res) => {
    let email = req.params.email;
    const messages = await daoMessages.getByUsr(email)
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    if(messages.length>0){
        res.status(200).send(messages)
    }else{
        res.status(200).send('No se encontaron mensajes');
    }
    
}

//devuelvo todos los mensajes
export const getMessages = async (req, res) => {
    const messages = await daoMessages.getAll();
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    if(messages.length>0){
        res.status(200).send(messages)
    }else{
        res.status(200).send('No se encontaron mensajes');
    }
}