const express = require("express");
const mongoose = require("mongoose");

const Partido = require("../modelos/Partido");
const verificarToken = require("../middlewares/verificarToken");

const router = express.Router();

const partidosPorDefecto = [
    // BENJAMÍN - GRUPOS
    {
        categoria: "benjamin",
        tipo: "grupo",
        fase: "Grupo A",
        grupo: "A",
        campo: "Campo Chutapp",
        equipoLocal: "San Roque EFF",
        equipoVisitante: "Madrid CFF",
        hora: "9:30",
        resultado: "",
        orden: 1,
        visible: true
    },
    {
        categoria: "benjamin",
        tipo: "grupo",
        fase: "Grupo A",
        grupo: "A",
        campo: "Campo Chutapp",
        equipoLocal: "Madrid CFF",
        equipoVisitante: "Getafe SAD",
        hora: "10:00",
        resultado: "",
        orden: 2,
        visible: true
    },
    {
        categoria: "benjamin",
        tipo: "grupo",
        fase: "Grupo A",
        grupo: "A",
        campo: "Campo Chutapp",
        equipoLocal: "Getafe SAD",
        equipoVisitante: "San Roque EFF",
        hora: "10:30",
        resultado: "",
        orden: 3,
        visible: true
    },
    {
        categoria: "benjamin",
        tipo: "grupo",
        fase: "Grupo B",
        grupo: "B",
        campo: "Campo Quazzartech",
        equipoLocal: "Sporting Hortaleza",
        equipoVisitante: "Alameda Osuna",
        hora: "9:30",
        resultado: "",
        orden: 4,
        visible: true
    },
    {
        categoria: "benjamin",
        tipo: "grupo",
        fase: "Grupo B",
        grupo: "B",
        campo: "Campo Quazzartech",
        equipoLocal: "Mejoreño",
        equipoVisitante: "Sporting Hortaleza",
        hora: "10:00",
        resultado: "",
        orden: 5,
        visible: true
    },
    {
        categoria: "benjamin",
        tipo: "grupo",
        fase: "Grupo B",
        grupo: "B",
        campo: "Campo Quazzartech",
        equipoLocal: "Alameda Osuna",
        equipoVisitante: "Mejoreño",
        hora: "10:30",
        resultado: "",
        orden: 6,
        visible: true
    },

    // BENJAMÍN - ELIMINATORIAS
    {
        categoria: "benjamin",
        tipo: "eliminatoria",
        fase: "Semifinal 1",
        grupo: "",
        campo: "Campo Chutapp",
        equipoLocal: "1º Grupo A",
        equipoVisitante: "2º Grupo B",
        hora: "11:00",
        resultado: "",
        orden: 7,
        visible: true
    },
    {
        categoria: "benjamin",
        tipo: "eliminatoria",
        fase: "Semifinal 2",
        grupo: "",
        campo: "Campo Quazzartech",
        equipoLocal: "1º Grupo B",
        equipoVisitante: "2º Grupo A",
        hora: "11:00",
        resultado: "",
        orden: 8,
        visible: true
    },
    {
        categoria: "benjamin",
        tipo: "eliminatoria",
        fase: "5º / 6º Puesto",
        grupo: "",
        campo: "Campo Chutapp",
        equipoLocal: "3º Grupo A",
        equipoVisitante: "3º Grupo B",
        hora: "11:30",
        resultado: "",
        orden: 9,
        visible: true
    },
    {
        categoria: "benjamin",
        tipo: "eliminatoria",
        fase: "3º / 4º Puesto",
        grupo: "",
        campo: "Campo Quazzartech",
        equipoLocal: "Perdedor SF1",
        equipoVisitante: "Perdedor SF2",
        hora: "11:30",
        resultado: "",
        orden: 10,
        visible: true
    },
    {
        categoria: "benjamin",
        tipo: "final",
        fase: "Gran Final",
        grupo: "",
        campo: "Campo Chutapp",
        equipoLocal: "Ganador SF1",
        equipoVisitante: "Ganador SF2",
        hora: "12:00",
        resultado: "",
        orden: 11,
        visible: true
    },

    // ALEVÍN - GRUPOS
    {
        categoria: "alevin",
        tipo: "grupo",
        fase: "Grupo A",
        grupo: "A",
        campo: "Campo Chutapp",
        equipoLocal: "San Roque EFF",
        equipoVisitante: "Getafe SAD",
        hora: "13:30",
        resultado: "",
        orden: 1,
        visible: true
    },
    {
        categoria: "alevin",
        tipo: "grupo",
        fase: "Grupo A",
        grupo: "A",
        campo: "Campo Chutapp",
        equipoLocal: "Getafe SAD",
        equipoVisitante: "D.A.V. Santa Ana",
        hora: "14:00",
        resultado: "",
        orden: 2,
        visible: true
    },
    {
        categoria: "alevin",
        tipo: "grupo",
        fase: "Grupo A",
        grupo: "A",
        campo: "Campo Chutapp",
        equipoLocal: "D.A.V. Santa Ana",
        equipoVisitante: "San Roque EFF",
        hora: "14:30",
        resultado: "",
        orden: 3,
        visible: true
    },
    {
        categoria: "alevin",
        tipo: "grupo",
        fase: "Grupo B",
        grupo: "B",
        campo: "Campo Quazzartech",
        equipoLocal: "Madrid CFF",
        equipoVisitante: "Sporting Hortaleza",
        hora: "13:30",
        resultado: "",
        orden: 4,
        visible: true
    },
    {
        categoria: "alevin",
        tipo: "grupo",
        fase: "Grupo B",
        grupo: "B",
        campo: "Campo Quazzartech",
        equipoLocal: "Escuela de Fútbol AFE",
        equipoVisitante: "Madrid CFF",
        hora: "14:00",
        resultado: "",
        orden: 5,
        visible: true
    },
    {
        categoria: "alevin",
        tipo: "grupo",
        fase: "Grupo B",
        grupo: "B",
        campo: "Campo Quazzartech",
        equipoLocal: "Sporting Hortaleza",
        equipoVisitante: "Escuela de Fútbol AFE",
        hora: "14:30",
        resultado: "",
        orden: 6,
        visible: true
    },

    // ALEVÍN - ELIMINATORIAS
    {
        categoria: "alevin",
        tipo: "eliminatoria",
        fase: "Semifinal 1",
        grupo: "",
        campo: "Campo Chutapp",
        equipoLocal: "1º Grupo A",
        equipoVisitante: "2º Grupo B",
        hora: "15:00",
        resultado: "",
        orden: 7,
        visible: true
    },
    {
        categoria: "alevin",
        tipo: "eliminatoria",
        fase: "Semifinal 2",
        grupo: "",
        campo: "Campo Quazzartech",
        equipoLocal: "1º Grupo B",
        equipoVisitante: "2º Grupo A",
        hora: "15:00",
        resultado: "",
        orden: 8,
        visible: true
    },
    {
        categoria: "alevin",
        tipo: "eliminatoria",
        fase: "5º / 6º Puesto",
        grupo: "",
        campo: "Campo Chutapp",
        equipoLocal: "3º Grupo A",
        equipoVisitante: "3º Grupo B",
        hora: "15:30",
        resultado: "",
        orden: 9,
        visible: true
    },
    {
        categoria: "alevin",
        tipo: "eliminatoria",
        fase: "3º / 4º Puesto",
        grupo: "",
        campo: "Campo Quazzartech",
        equipoLocal: "Perdedor SF1",
        equipoVisitante: "Perdedor SF2",
        hora: "15:30",
        resultado: "",
        orden: 10,
        visible: true
    },
    {
        categoria: "alevin",
        tipo: "final",
        fase: "Gran Final",
        grupo: "",
        campo: "Campo Chutapp",
        equipoLocal: "Ganador SF1",
        equipoVisitante: "Ganador SF2",
        hora: "16:00",
        resultado: "",
        orden: 11,
        visible: true
    }
];

router.get("/", async (req, res) => {
    try {
        const categoria = req.query.categoria;

        if (mongoose.connection.readyState !== 1) {
            if (categoria) {
                const partidosFiltrados = partidosPorDefecto.filter(function (partido) {
                    return partido.categoria === categoria && partido.visible === true;
                });

                return res.json(partidosFiltrados);
            }

            return res.json(partidosPorDefecto);
        }

        const filtro = { visible: true };

        if (categoria) {
            filtro.categoria = categoria;
        }

        const partidos = await Partido.find(filtro).sort({ categoria: 1, orden: 1 });

        res.json(partidos);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los partidos"
        });
    }
});

router.get("/admin/todos", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json(partidosPorDefecto);
        }

        const partidos = await Partido.find().sort({
            categoria: 1,
            orden: 1
        });

        res.json(partidos);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los partidos"
        });
    }
});

router.get("/:categoria", async (req, res) => {
    try {
        const categoria = req.params.categoria;

        if (mongoose.connection.readyState !== 1) {
            const partidosFiltrados = partidosPorDefecto.filter(function (partido) {
                return partido.categoria === categoria && partido.visible === true;
            });

            return res.json(partidosFiltrados);
        }

        const partidos = await Partido.find({
            categoria: categoria,
            visible: true
        }).sort({ orden: 1 });

        res.json(partidos);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los partidos de la categoría"
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

        const nuevoPartido = new Partido(req.body);
        await nuevoPartido.save();

        res.status(201).json({
            mensaje: "Partido creado correctamente",
            partido: nuevoPartido
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el partido"
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

        const partidoActualizado = await Partido.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!partidoActualizado) {
            return res.status(404).json({
                mensaje: "Partido no encontrado"
            });
        }

        res.json({
            mensaje: "Partido actualizado correctamente",
            partido: partidoActualizado
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el partido"
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

        const partidoEliminado = await Partido.findByIdAndDelete(req.params.id);

        if (!partidoEliminado) {
            return res.status(404).json({
                mensaje: "Partido no encontrado"
            });
        }

        res.json({
            mensaje: "Partido eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el partido"
        });
    }
});

module.exports = router;