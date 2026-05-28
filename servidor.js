const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const rutasUsuarios = require("./rutas/usuarios");
const rutasTorneo = require("./rutas/torneo");
const rutasCategorias = require("./rutas/categorias");
const rutasPartidos = require("./rutas/partidos");
const rutasPatrocinadores = require("./rutas/patrocinadores");
const rutasSorteos = require("./rutas/sorteos");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/usuarios", rutasUsuarios);
app.use("/api/torneo", rutasTorneo);
app.use("/api/categorias", rutasCategorias);
app.use("/api/partidos", rutasPartidos);
app.use("/api/patrocinadores", rutasPatrocinadores);
app.use("/api/sorteos", rutasSorteos);

const PORT = process.env.PORT || 3000;

app.get("/api/prueba", (req, res) => {
    res.json({
        mensaje: "Servidor funcionando correctamente"
    });
});

async function conectarMongoDB() {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri === "tu_conexion_de_mongodb_atlas") {
        console.log("MongoDB todavía no está configurado en el archivo .env");
        return;
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("Conectado correctamente a MongoDB");
    } catch (error) {
        console.log("Error al conectar con MongoDB");
        console.log(error.message);
    }
}

async function iniciarServidor() {
    await conectarMongoDB();

    app.listen(PORT, () => {
        console.log(`Servidor funcionando en http://localhost:${PORT}`);
    });
}

if (require.main === module) {
    iniciarServidor();
}

module.exports = {
    app,
    conectarMongoDB,
    iniciarServidor
};