const express = require("express");
const mongoose = require("mongoose");

const Torneo = require("../modelos/Torneo");
const verificarToken = require("../middlewares/verificarToken");

const router = express.Router();

const torneoPorDefecto = {
    nombreHeader: "TORNEO",
    nombreDestacado: "BENÉFICO",
    club: "CD San Roque EFF",
    causa: "Contra el Cáncer Infantil",
    causaCompleta: "Contra el Cáncer Infantil DIPG",
    hashtag: "#FútbolConCorazón",
    fechaTexto: "30 Mayo 2026",
    dia: "30",
    mes: "Mayo 2026",
    lugar: "Estadio Municipal José Luis Sánchez Juez",
    ciudad: "San Roque, Madrid",
    descripcion: "Torneo benéfico de fútbol base.",
    footerTexto: "Juntos marcamos la diferencia · #FútbolConCorazón",
    logo: "",
    imagenPrincipal: "",
    activo: true
};

router.get("/", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json(torneoPorDefecto);
        }

        let torneo = await Torneo.findOne({ activo: true });

        if (!torneo) {
            torneo = torneoPorDefecto;
        }

        res.json(torneo);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los datos del torneo"
        });
    }
});

router.put("/", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                mensaje: "MongoDB todavía no está conectado"
            });
        }

        let torneo = await Torneo.findOne({ activo: true });

        if (!torneo) {
            torneo = new Torneo(req.body);
        } else {
            torneo.nombreHeader = req.body.nombreHeader;
            torneo.nombreDestacado = req.body.nombreDestacado;
            torneo.club = req.body.club;
            torneo.causa = req.body.causa;
            torneo.causaCompleta = req.body.causaCompleta;
            torneo.hashtag = req.body.hashtag;
            torneo.fechaTexto = req.body.fechaTexto;
            torneo.dia = req.body.dia;
            torneo.mes = req.body.mes;
            torneo.lugar = req.body.lugar;
            torneo.ciudad = req.body.ciudad;
            torneo.descripcion = req.body.descripcion;
            torneo.footerTexto = req.body.footerTexto;
            torneo.logo = req.body.logo;
            torneo.imagenPrincipal = req.body.imagenPrincipal;
            torneo.activo = true;
        }

        await torneo.save();

        res.json({
            mensaje: "Datos del torneo guardados correctamente",
            torneo: torneo
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al guardar los datos del torneo"
        });
    }
});

module.exports = router;