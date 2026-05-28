const mongoose = require("mongoose");
require("dotenv").config();

const Torneo = require("../modelos/Torneo");
const Categoria = require("../modelos/Categoria");
const Partido = require("../modelos/Partido");
const Patrocinador = require("../modelos/Patrocinador");
const Sorteo = require("../modelos/Sorteo");

const torneoInicial = {
    nombreHeader: "TORNEO",
    nombreDestacado: "BENÉFICO",
    club: "CD San Roque EFF",
    causa: "Contra el Cáncer Infantil",
    causaCompleta: "Contra el Cáncer Infantil DIPG",
    hashtag: "#FútbolConCorazón",
    fechaTexto: "30 Mayo 2026",
    dia: "30",
    mes: "Mayo 2026",
    lugar: "Estadio Municipal José Luis Sánchez Juez",
    ciudad: "San Roque, Madrid",
    descripcion: "Torneo benéfico de fútbol base.",
    footerTexto: "Juntos marcamos la diferencia · #FútbolConCorazón",
    logo: "",
    imagenPrincipal: "",
    activo: true
};

const categoriasIniciales = [
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

const partidosIniciales = [
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
    {
        categoria: "benjamin",
        tipo: "eliminatoria",
        fase: "Semifinal 1",
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
        campo: "Campo Chutapp",
        equipoLocal: "Ganador SF1",
        equipoVisitante: "Ganador SF2",
        hora: "12:00",
        resultado: "",
        orden: 11,
        visible: true
    },

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
    {
        categoria: "alevin",
        tipo: "eliminatoria",
        fase: "Semifinal 1",
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
        campo: "Campo Chutapp",
        equipoLocal: "Ganador SF1",
        equipoVisitante: "Ganador SF2",
        hora: "16:00",
        resultado: "",
        orden: 11,
        visible: true
    }
];

const patrocinadoresIniciales = [
    {
        nombre: "Bar San Roque",
        descripcion: "Colaborador principal del torneo",
        logo: "",
        icono: "☕",
        enlace: "",
        orden: 1,
        visible: true
    },
    {
        nombre: "Clínica Dental López",
        descripcion: "Patrocinador sanitario",
        logo: "",
        icono: "🦷",
        enlace: "",
        orden: 2,
        visible: true
    },
    {
        nombre: "Talleres García",
        descripcion: "Sorteo solidario",
        logo: "",
        icono: "🔧",
        enlace: "",
        orden: 3,
        visible: true
    }
];

const sorteosIniciales = [
    {
        titulo: "Sorteo de Tablet",
        descripcion: "Sorteo solidario durante el torneo",
        icono: "📱",
        imagen: "",
        orden: 1,
        visible: true
    },
    {
        titulo: "Camisetas de fútbol firmadas",
        descripcion: "Camisetas firmadas para sorteo solidario",
        icono: "👕",
        imagen: "",
        orden: 2,
        visible: true
    },
    {
        titulo: "Sorteo sorpresa",
        descripcion: "Premio sorpresa del torneo",
        icono: "🎁",
        imagen: "",
        orden: 3,
        visible: true
    }
];

async function insertarDatos() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado a MongoDB");

        await Torneo.deleteMany({});
        await Categoria.deleteMany({});
        await Partido.deleteMany({});
        await Patrocinador.deleteMany({});
        await Sorteo.deleteMany({});

        await Torneo.create(torneoInicial);
        await Categoria.insertMany(categoriasIniciales);
        await Partido.insertMany(partidosIniciales);
        await Patrocinador.insertMany(patrocinadoresIniciales);
        await Sorteo.insertMany(sorteosIniciales);

        console.log("Datos iniciales insertados correctamente");

        await mongoose.disconnect();
        console.log("Desconectado de MongoDB");

    } catch (error) {
        console.log("Error al insertar datos iniciales");
        console.log(error.message);
    }
}

insertarDatos();