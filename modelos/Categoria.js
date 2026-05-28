const mongoose = require("mongoose");

const grupoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },

    equipos: {
        type: [String],
        default: []
    }
}, {
    _id: false
});

const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true,
        unique: true
    },

    color: {
        type: String,
        default: "benjamin"
    },

    horario: {
        type: String,
        default: ""
    },

    trofeos: {
        type: String,
        default: ""
    },

    grupos: {
        type: [grupoSchema],
        default: []
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

module.exports = mongoose.model("Categoria", categoriaSchema);