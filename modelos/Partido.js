const mongoose = require("mongoose");

const partidoSchema = new mongoose.Schema({
    categoria: {
        type: String,
        required: true
    },

    tipo: {
        type: String,
        default: "grupo"
    },

    fase: {
        type: String,
        default: ""
    },

    grupo: {
        type: String,
        default: ""
    },

    campo: {
        type: String,
        default: ""
    },

    equipoLocal: {
        type: String,
        default: ""
    },

    equipoVisitante: {
        type: String,
        default: ""
    },

    hora: {
        type: String,
        default: ""
    },

    resultado: {
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

module.exports = mongoose.model("Partido", partidoSchema);