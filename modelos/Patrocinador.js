const mongoose = require("mongoose");

const patrocinadorSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },

    descripcion: {
        type: String,
        default: ""
    },

    logo: {
        type: String,
        default: ""
    },

    icono: {
        type: String,
        default: "🤝"
    },

    enlace: {
        type: String,
        default: ""
    },

    orden: {
        type: Number,
        default: 0
    },

    visible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Patrocinador", patrocinadorSchema);