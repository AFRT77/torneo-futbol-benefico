const express = require("express");
const mongoose = require("mongoose");

const Categoria = require("../modelos/Categoria");
const verificarToken = require("../middlewares/verificarToken");

const router = express.Router();

const categoriasPorDefecto = [
    {
        nombre: "Benjamín",
        slug: "benjamin",
        color: "benjamin",
        horario: "9:30 – 12:30 h",
        trofeos: "12:30 | Entrega de Trofeos 🏆",
        grupos: [
            {
                nombre: "Grupo A",
                equipos: [
                    "CD San Roque EFF",
                    "Getafe CF SAD",
                    "Madrid CFF"
                ]
            },
            {
                nombre: "Grupo B",
                equipos: [
                    "AD Sporting de Hortaleza",
                    "Alameda de Osuna EF",
                    "CD Mejoreño"
                ]
            }
        ],
        orden: 1,
        visible: true
    },
    {
        nombre: "Alevín",
        slug: "alevin",
        color: "alevin",
        horario: "13:30 – 16:30 h",
        trofeos: "16:30 | Entrega de Trofeos 🏆",
        grupos: [
            {
                nombre: "Grupo A",
                equipos: [
                    "CD San Roque EFF",
                    "Getafe CF SAD",
                    "D.A.V. Santa Ana"
                ]
            },
            {
                nombre: "Grupo B",
                equipos: [
                    "Madrid CFF",
                    "AD Sporting de Hortaleza",
                    "Escuela de Fútbol AFE"
                ]
            }
        ],
        orden: 2,
        visible: true
    }
];

router.get("/", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json(categoriasPorDefecto);
        }

        const categorias = await Categoria.find({ visible: true }).sort({ orden: 1 });

        res.json(categorias);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las categorías"
        });
    }
});

router.get("/admin/todas", verificarToken, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json(categoriasPorDefecto);
        }

        const categorias = await Categoria.find().sort({ orden: 1 });

        res.json(categorias);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las categorías"
        });
    }
});

router.get("/:slug", async (req, res) => {
    try {
        const slug = req.params.slug;

        if (mongoose.connection.readyState !== 1) {
            const categoria = categoriasPorDefecto.find(function (cat) {
                return cat.slug === slug;
            });

            if (!categoria) {
                return res.status(404).json({
                    mensaje: "Categoría no encontrada"
                });
            }

            return res.json(categoria);
        }

        const categoria = await Categoria.findOne({
            slug: slug,
            visible: true
        });

        if (!categoria) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.json(categoria);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener la categoría"
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

        const nuevaCategoria = new Categoria(req.body);
        await nuevaCategoria.save();

        res.status(201).json({
            mensaje: "Categoría creada correctamente",
            categoria: nuevaCategoria
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear la categoría"
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

        const categoriaActualizada = await Categoria.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!categoriaActualizada) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.json({
            mensaje: "Categoría actualizada correctamente",
            categoria: categoriaActualizada
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar la categoría"
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

        const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);

        if (!categoriaEliminada) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.json({
            mensaje: "Categoría eliminada correctamente"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la categoría"
        });
    }
});

module.exports = router;