const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            mensaje: "No se ha enviado token"
        });
    }

    const partes = authHeader.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
        return res.status(401).json({
            mensaje: "Formato de token no válido"
        });
    }

    const token = partes[1];

    try {
        const datos = jwt.verify(token, process.env.JWT_SECRET);

        if (datos.rol !== "admin") {
            return res.status(403).json({
                mensaje: "No tienes permisos"
            });
        }

        req.usuario = datos;
        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: "Token no válido o caducado"
        });
    }
}

module.exports = verificarToken;