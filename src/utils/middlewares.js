//validacion de administrador 
export const isAdmin = (req, res, next) => {
    let admin = req.session.user.isAdmin;
    if (admin) {
        next();
    } else {
        res.status(401).send({ error: `Error:Descripcion: Ruta ${req.route.path}/Método ${req.method} no autorizados` })
    }
}

//validacion de user loggeado 
export const isLoggedIn = (req, res, next) => {

    if (!req.session.user) {
        res.status(401).send({ error: `Error:Descripcion: USER NO LOGGEADO` })
    } else {
        next();
    }
}