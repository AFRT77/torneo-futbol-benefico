const express = require("express");
const mongoose = require("mongoose");

const Sorteo = require("../modelos/Sorteo");
const verificarToken = require("../middlewares/verificarToken");

const router = express.Router();

const sorteosPorDefecto = [
    {
        titulo: "Sorteo de Tablet",
        descripcion: "Sorteo solidario durante el torneo",
        icono: "📱",
        imagen: "",
        orden: 1,
        visible: true
    },
    {
        titulo: "Sorteo Disco de Leiva",
        descripcion: "Premio especial para los participantes",
        icono: "💿",
        imagen: "",
        orden: 2,
        visible: true
    },
    {
        titulo: "Camisetas de fútbol firmadas",
        descripcion: "Camisetas firmadas para sorteo solidario",
        icono: "👕",
        imagen: "",
        orden: 3,
        visible: true
    },
    {
        titulo: "Entradas para Palco VIP",
        descripcion: "Entradas especiales para sorteo",
        icono: "🎟",
        imagen: "",
        orden: 4,
        visible: true
    },
    {
        titulo: "Sorteo sorpresa",
        descripcion: "Premio sorpresa del torneo",
        icono: "🎁",
        imagen: "",
        orden: 5,
        visible: true
    }
];

router.get("/", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json(sorteosPorDefecto);
        }

        const sorteos = await Sorteo.find({ visible: true }).sort({ orden: 1 });

        res.json(sorteos);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los sorteos"
        });
    }
});

router.get("/admin/todos", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json(sorteosPorDefecto);
        }

        const sorteos = await Sorteo.find().sort({ orden: 1 });

        res.json(sorteos);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los sorteos"
        });
    }
});

router.post("/admin/reemplazar", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                mensaje: "MongoDB todavía no está conectado"
            });
        }

        const sorteos = req.body.sorteos;

        if (!Array.isArray(sorteos)) {
            return res.status(400).json({
                mensaje: "Los sorteos deben enviarse en un array"
            });
        }

        await Sorteo.deleteMany({});

        const sorteosLimpios = [];

        for (let i = 0; i < sorteos.length; i++) {
            const sorteo = sorteos[i];

            if (sorteo.titulo && sorteo.titulo.trim() !== "") {
                sorteosLimpios.push({
                    titulo: sorteo.titulo,
                    descripcion: sorteo.descripcion || "",
                    icono: sorteo.icono || "🎁",
                    imagen: sorteo.imagen || "",
                    orden: Number(sorteo.orden) || i + 1,
                    visible: sorteo.visible !== false
                });
            }
        }

        const sorteosGuardados = await Sorteo.insertMany(sorteosLimpios);

        res.json({
            mensaje: "Sorteos reemplazados correctamente",
            sorteos: sorteosGuardados
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al reemplazar los sorteos"
        });
    }
});

router.post("/", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                mensaje: "MongoDB todavía no está conectado"
            });
        }

        const nuevoSorteo = new Sorteo(req.body);
        await nuevoSorteo.save();

        res.status(201).json({
            mensaje: "Sorteo creado correctamente",
            sorteo: nuevoSorteo
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el sorteo"
        });
    }
});

router.put("/:id", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                mensaje: "MongoDB todavía no está conectado"
            });
        }

        const sorteoActualizado = await Sorteo.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!sorteoActualizado) {
            return res.status(404).json({
                mensaje: "Sorteo no encontrado"
            });
        }

        res.json({
            mensaje: "Sorteo actualizado correctamente",
            sorteo: sorteoActualizado
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el sorteo"
        });
    }
});

router.delete("/:id", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                mensaje: "MongoDB todavía no está conectado"
            });
        }

        const sorteoEliminado = await Sorteo.findByIdAndDelete(req.params.id);

        if (!sorteoEliminado) {
            return res.status(404).json({
                mensaje: "Sorteo no encontrado"
            });
        }

        res.json({
            mensaje: "Sorteo eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el sorteo"
        });
    }
});

module.exports = router;