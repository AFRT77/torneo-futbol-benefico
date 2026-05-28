const mongoose = require("mongoose");

const sorteoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },

    descripcion: {
        type: String,
        default: ""
    },

    icono: {
        type: String,
        default: "🎁"
    },

    imagen: {
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

module.exports = mongoose.model("Sorteo", sorteoSchema);