const express = require("express");
const mongoose = require("mongoose");

const Equipo = require("../modelos/Equipo");
const verificarToken = require("../middlewares/verificarToken");

const router = express.Router();

const equiposPorDefecto = [
    {
        nombre: "CD San Roque EFF",
        logo: "",
        icono: "🛡",
        orden: 1,
        visible: true
    },
    {
        nombre: "Getafe CF SAD",
        logo: "",
        icono: "⭐",
        orden: 2,
        visible: true
    },
    {
        nombre: "Madrid CFF",
        logo: "",
        icono: "🏛",
        orden: 3,
        visible: true
    },
    {
        nombre: "AD Sporting de Hortaleza",
        logo: "",
        icono: "⚡",
        orden: 4,
        visible: true
    },
    {
        nombre: "Escuela de Fútbol AFE",
        logo: "",
        icono: "🔵",
        orden: 5,
        visible: true
    },
    {
        nombre: "D.A.V. Santa Ana",
        logo: "",
        icono: "🌟",
        orden: 6,
        visible: true
    },
    {
        nombre: "Alameda de Osuna EF",
        logo: "",
        icono: "🔴",
        orden: 7,
        visible: true
    },
    {
        nombre: "CD Mejoreño",
        logo: "",
        icono: "💪",
        orden: 8,
        visible: true
    }
];

// Obtener equipos visibles para la parte pública
router.get("/", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json(equiposPorDefecto);
        }

        const equipos = await Equipo.find({
            visible: true
        }).sort({
            orden: 1
        });

        res.json(equipos);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los equipos"
        });
    }
});

// Obtener todos los equipos para el panel admin
router.get("/admin/todos", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json(equiposPorDefecto);
        }

        const equipos = await Equipo.find().sort({
            orden: 1
        });

        res.json(equipos);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los equipos"
        });
    }
});

// Reemplazar todos los equipos desde el panel admin
router.post("/admin/reemplazar", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                mensaje: "MongoDB todavía no está conectado"
            });
        }

        const equipos = req.body.equipos;

        if (!Array.isArray(equipos)) {
            return res.status(400).json({
                mensaje: "Los equipos deben enviarse en un array"
            });
        }

        await Equipo.deleteMany({});

        const equiposLimpios = [];

        for (let i = 0; i < equipos.length; i++) {
            const equipo = equipos[i];

            if (equipo.nombre && equipo.nombre.trim() !== "") {
                equiposLimpios.push({
                    nombre: equipo.nombre,
                    logo: equipo.logo || "",
                    icono: equipo.icono || "⚽",
                    orden: Number(equipo.orden) || i + 1,
                    visible: equipo.visible !== false
                });
            }
        }

        const equiposGuardados = await Equipo.insertMany(equiposLimpios);

        res.json({
            mensaje: "Equipos guardados correctamente",
            equipos: equiposGuardados
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al guardar los equipos"
        });
    }
});

// Crear equipo
router.post("/", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                mensaje: "MongoDB todavía no está conectado"
            });
        }

        const nuevoEquipo = new Equipo({
            nombre: req.body.nombre,
            logo: req.body.logo,
            icono: req.body.icono,
            orden: req.body.orden,
            visible: req.body.visible
        });

        await nuevoEquipo.save();

        res.status(201).json({
            mensaje: "Equipo creado correctamente",
            equipo: nuevoEquipo
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el equipo"
        });
    }
});

// Actualizar equipo
router.put("/:id", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                mensaje: "MongoDB todavía no está conectado"
            });
        }

        const equipoActualizado = await Equipo.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre,
                logo: req.body.logo,
                icono: req.body.icono,
                orden: req.body.orden,
                visible: req.body.visible
            },
            { new: true }
        );

        if (!equipoActualizado) {
            return res.status(404).json({
                mensaje: "Equipo no encontrado"
            });
        }

        res.json({
            mensaje: "Equipo actualizado correctamente",
            equipo: equipoActualizado
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el equipo"
        });
    }
});

// Eliminar equipo
router.delete("/:id", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                mensaje: "MongoDB todavía no está conectado"
            });
        }

        const equipoEliminado = await Equipo.findByIdAndDelete(req.params.id);

        if (!equipoEliminado) {
            return res.status(404).json({
                mensaje: "Equipo no encontrado"
            });
        }

        res.json({
            mensaje: "Equipo eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el equipo"
        });
    }
});

module.exports = router;