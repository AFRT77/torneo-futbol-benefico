const mongoose = require("mongoose");

const equipoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },

    logo: {
        type: String,
        default: ""
    },

    icono: {
        type: String,
        default: "⚽"
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

module.exports = mongoose.model("Equipo", equipoSchema);