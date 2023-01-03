//validacion de administrador SE SETEA TRUE DE MANERA PROVISORIA

export const isAdmin = (req,res, next) => {
    let admin= req.session.user.isAdmin;
    if (admin) {
        next();
    } else {
        res.status(401).send({ error: `Error:Descripcion: Ruta ${req.route.path}/Método ${req.method} no autorizados` })
    }

}