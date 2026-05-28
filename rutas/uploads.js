const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const verificarToken = require("../middlewares/verificarToken");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post("/imagen", verificarToken, upload.single("imagen"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                mensaje: "No se ha enviado ninguna imagen"
            });
        }

        const carpeta = req.body.carpeta || "torneo";

        const resultado = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "torneo-futbol/" + carpeta,
                    resource_type: "image"
                },
                function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(req.file.buffer);
        });

        res.json({
            mensaje: "Imagen subida correctamente",
            url: resultado.secure_url
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al subir la imagen"
        });
    }
});

module.exports = router;