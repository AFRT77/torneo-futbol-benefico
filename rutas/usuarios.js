const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (req, res) => {
    const password = req.body.password;

    if (!password) {
        return res.status(400).json({
            mensaje: "La contraseña es obligatoria"
        });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({
            mensaje: "Contraseña incorrecta"
        });
    }

    const token = jwt.sign(
        { rol: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );

    res.json({
        mensaje: "Login correcto",
        token: token
    });
});

module.exports = router;