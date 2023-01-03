import { logger } from "../../logger_config.js"
import { __dirname,daoUsr } from "../../server.js";
import { socketChat } from "../utils/chat.js";



export const userSignup = (req, res) => {
    req.session.user = req.user;
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    res.status(200).send("SIGNED UP!")
    //res.redirect("/login");
}

export const userLogin = async (req, res) => {
    req.session.user = req.user;
    await socketChat(req.session.usr);
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    res.status(200).send("LOGGED OK!");
}


export const checkLogin = (req, res) => {
    //Si esta autenticado va a directo a dashboard
    if (!req.session.user) {
        res.sendFile(__dirname + "/public/login.html");
    } else {
        logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    }
}

export const userLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            logger.log("error", `Error al cerrar sesion: ${err}`);
        }
        logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
        res.redirect("/login")
    });
}

export const loginFail = (req, res) => {
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    res.status(401).send(`LOGIN FAIL`);
    //res.sendFile(__dirname + "/public/failLogin.html");
}

export const signupFail = (req, res) => {
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    res.status(401).send(`SIGNUP FAIL`);
    //res.sendFile(__dirname + "/public/failSignup.html");
}

export const userToAdmin= async(req, res)=>{
    const id=req.params.id
    await daoUsr.userToAdmin(id);
    logger.log("info", `Ruta: ${req.url}, Metodo: ${req.method}`);
    res.status(200).send(`USR ID: ${id} is admin.`);
}

export const badRoute = (req, res) => {
    logger.log("warn", `Ruta no encontrada: ${req.url}`)
    res.status(400).send(`Ruta no encontrada: ${req.url}`);
}




