//validacion de administrador 
export const isAdmin = (req, res, next) => {
    let admin = req.session.usr.isAdmin;
    if (admin == true) {
        next();
    } else {
        res.status(401).send( `Error:Descripcion: Ruta ${req.route.path}/Método ${req.method} no autorizados` );
    }
}

//validacion de user loggeado 
export const isLoggedIn = (req, res, next) => {

    if (!req.session.usr) {
        res.status(401).send(`USER NO LOGGEADO`);
    } else {
        next();
    }
}