const express = require("express");
const mongoose = require("mongoose");

const Patrocinador = require("../modelos/Patrocinador");
const verificarToken = require("../middlewares/verificarToken");

const router = express.Router();

const patrocinadoresPorDefecto = [
    {
        nombre: "Bar San Roque",
        descripcion: "Colaborador principal del torneo",
        logo: "",
        icono: "☕",
        enlace: "",
        orden: 1,
        visible: true
    },
    {
        nombre: "Clínica Dental López",
        descripcion: "Patrocinador sanitario",
        logo: "",
        icono: "🦷",
        enlace: "",
        orden: 2,
        visible: true
    },
    {
        nombre: "Talleres García",
        descripcion: "Sorteo solidario",
        logo: "",
        icono: "🔧",
        enlace: "",
        orden: 3,
        visible: true
    }
];

// Obtener patrocinadores visibles para la página pública
router.get("/", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json(patrocinadoresPorDefecto);
        }

        const patrocinadores = await Patrocinador.find({
            visible: true
        }).sort({
            orden: 1
        });

        res.json(patrocinadores);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los patrocinadores"
        });
    }
});

// Obtener todos los patrocinadores para el panel admin
// IMPORTANTE: esta ruta debe ir antes de router.put("/:id") y router.delete("/:id")
router.get("/admin/todos", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json(patrocinadoresPorDefecto);
        }

        const patrocinadores = await Patrocinador.find().sort({
            orden: 1
        });

        res.json(patrocinadores);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los patrocinadores"
        });
    }
});

// Crear patrocinador
router.post("/", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                mensaje: "MongoDB todavía no está conectado"
            });
        }

        const nuevoPatrocinador = new Patrocinador({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            logo: req.body.logo,
            icono: req.body.icono,
            enlace: req.body.enlace,
            orden: req.body.orden,
            visible: req.body.visible
        });

        await nuevoPatrocinador.save();

        res.status(201).json({
            mensaje: "Patrocinador creado correctamente",
            patrocinador: nuevoPatrocinador
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el patrocinador"
        });
    }
});

// Actualizar patrocinador
router.put("/:id", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                mensaje: "MongoDB todavía no está conectado"
            });
        }

        const patrocinadorActualizado = await Patrocinador.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                logo: req.body.logo,
                icono: req.body.icono,
                enlace: req.body.enlace,
                orden: req.body.orden,
                visible: req.body.visible
            },
            { new: true }
        );

        if (!patrocinadorActualizado) {
            return res.status(404).json({
                mensaje: "Patrocinador no encontrado"
            });
        }

        res.json({
            mensaje: "Patrocinador actualizado correctamente",
            patrocinador: patrocinadorActualizado
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el patrocinador"
        });
    }
});

// Eliminar patrocinador
router.delete("/:id", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                mensaje: "MongoDB todavía no está conectado"
            });
        }

        const patrocinadorEliminado = await Patrocinador.findByIdAndDelete(req.params.id);

        if (!patrocinadorEliminado) {
            return res.status(404).json({
                mensaje: "Patrocinador no encontrado"
            });
        }

        res.json({
            mensaje: "Patrocinador eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el patrocinador"
        });
    }
});

module.exports = router;