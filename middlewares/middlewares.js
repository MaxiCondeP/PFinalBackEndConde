//validacion de administrador SE SETEA TRUE DE MANERA PROVISORIA

export const isAdmin = (req,res, next) => {
    const admin = true;
    if (admin) {
        next();
    } else {
        res.json({ error: `Error:-1, Descripcion: Ruta ${req.route.path}/Método ${req.method} no autorizados` })
    }

}