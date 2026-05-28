const mongoose = require("mongoose");

const torneoSchema = new mongoose.Schema({
    nombreHeader: {
        type: String,
        default: "TORNEO"
    },

    nombreDestacado: {
        type: String,
        default: "BENÉFICO"
    },

    club: {
        type: String,
        default: ""
    },

    causa: {
        type: String,
        default: ""
    },

    causaCompleta: {
        type: String,
        default: ""
    },

    hashtag: {
        type: String,
        default: ""
    },

    fechaTexto: {
        type: String,
        default: ""
    },

    dia: {
        type: String,
        default: ""
    },

    mes: {
        type: String,
        default: ""
    },

    lugar: {
        type: String,
        default: ""
    },

    ciudad: {
        type: String,
        default: ""
    },

    descripcion: {
        type: String,
        default: ""
    },

    footerTexto: {
        type: String,
        default: ""
    },

    logo: {
        type: String,
        default: ""
    },

    imagenPrincipal: {
        type: String,
        default: ""
    },

    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Torneo", torneoSchema);