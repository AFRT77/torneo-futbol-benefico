let torneo = null;
let categorias = [];
let sorteos = [];

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {
    await cargarDatos();

    if (torneo === null) {
        mostrarErrorInicio();
    } else {
        pintarDatosGenerales();
        pintarMenu();
        pintarHero();
        pintarInfoCards();
        pintarCategorias();
        pintarEquipos();
        pintarSorteos();
    }
}

async function cargarDatos() {
    try {
        const respuestaTorneo = await fetch("/api/torneo");
        torneo = await respuestaTorneo.json();

        const respuestaCategorias = await fetch("/api/categorias");
        categorias = await respuestaCategorias.json();

        const respuestaSorteos = await fetch("/api/sorteos");
        sorteos = await respuestaSorteos.json();

    } catch (error) {
        console.log("Error al cargar los datos del inicio");
        console.log(error);

        torneo = null;
        categorias = [];
        sorteos = [];
    }
}

function pintarDatosGenerales() {
    document.title = torneo.nombreHeader + " " + torneo.nombreDestacado;

    document.getElementById("header-titulo").innerHTML =
        torneo.nombreHeader + " <span>" + torneo.nombreDestacado + "</span>";

    document.getElementById("header-subtitulo").textContent =
        torneo.club + " · " + torneo.causa + " · " + torneo.hashtag;

    document.getElementById("header-dia").textContent = torneo.dia;
    document.getElementById("header-mes").textContent = torneo.mes;

    document.getElementById("footer-titulo").textContent =
        torneo.nombreHeader + " " + torneo.nombreDestacado + " · " + torneo.club + " · " + torneo.causaCompleta + " · " + torneo.fechaTexto;

    document.getElementById("footer-subtitulo").textContent = torneo.footerTexto;
}

function pintarMenu() {
    const navMenu = document.getElementById("nav-menu");
    navMenu.innerHTML = "";

    const enlaceInicio = crearEnlaceMenu("🏠 Inicio", "index.html", true);
    navMenu.appendChild(enlaceInicio);

    for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias[i];

        const enlace = document.createElement("a");
        enlace.href = "cuadrante.html?categoria=" + categoria.slug;
        enlace.className = "nav-btn";

        const texto = document.createTextNode("Cuadrante ");
        enlace.appendChild(texto);

        const span = document.createElement("span");
        span.className = "nav-cat";

        if (categoria.color === "alevin") {
            span.className = "nav-cat alevin";
        }

        span.textContent = categoria.nombre;
        enlace.appendChild(span);

        navMenu.appendChild(enlace);
    }

    const enlacePatrocinadores = crearEnlaceMenu("🤝 Patrocinadores", "patrocinadores.html", false);
    navMenu.appendChild(enlacePatrocinadores);

    const enlaceAdmin = document.createElement("a");
    enlaceAdmin.href = "login.html";
    enlaceAdmin.className = "nav-admin-btn";
    enlaceAdmin.textContent = "⚙ Admin";
    navMenu.appendChild(enlaceAdmin);
}

function crearEnlaceMenu(texto, href, activo) {
    const enlace = document.createElement("a");
    enlace.href = href;
    enlace.className = "nav-btn";

    if (activo) {
        enlace.className = "nav-btn active";
    }

    enlace.textContent = texto;

    return enlace;
}

function pintarHero() {
    document.getElementById("hero-badge").textContent =
        "🎗 TORNEO SOLIDARIO · " + torneo.fechaTexto.toUpperCase();

    const heroTitulo = document.getElementById("hero-titulo");
    heroTitulo.innerHTML = "";

    const linea1 = document.createElement("span");
    linea1.className = "line-yellow";
    linea1.textContent = torneo.nombreHeader;

    const salto1 = document.createElement("br");

    const linea2 = document.createElement("span");
    linea2.className = "line-red";
    linea2.textContent = torneo.nombreDestacado;

    const salto2 = document.createElement("br");

    const linea3 = document.createElement("span");
    linea3.textContent = torneo.causa;

    heroTitulo.appendChild(linea1);
    heroTitulo.appendChild(salto1);
    heroTitulo.appendChild(linea2);
    heroTitulo.appendChild(salto2);
    heroTitulo.appendChild(linea3);

    document.getElementById("hero-subtitulo").textContent =
        torneo.lugar + " (" + torneo.ciudad + ")";
}

function pintarInfoCards() {
    document.getElementById("info-ubicacion").innerHTML =
        "<strong>" + torneo.lugar + "</strong><br>" + torneo.ciudad;

    document.getElementById("info-fecha").innerHTML =
        "<strong>" + torneo.fechaTexto + "</strong><br>" + obtenerHorariosCategorias();

    document.getElementById("info-causa").innerHTML =
        "<strong>" + torneo.causaCompleta + "</strong><br>" + torneo.descripcion;

    document.getElementById("info-categorias").innerHTML =
        obtenerTextoCategorias();
}

function obtenerHorariosCategorias() {
    let texto = "";

    for (let i = 0; i < categorias.length; i++) {
        texto += categorias[i].nombre + ": " + categorias[i].horario;

        if (i < categorias.length - 1) {
            texto += "<br>";
        }
    }

    return texto;
}

function obtenerTextoCategorias() {
    let texto = "";

    for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias[i];
        const numeroEquipos = contarEquiposCategoria(categoria);

        texto += "<strong>" + categoria.nombre + "</strong> · " + numeroEquipos + " equipos";

        if (categoria.grupos && categoria.grupos.length > 0) {
            texto += " · " + categoria.grupos.length + " grupos";
        }

        if (i < categorias.length - 1) {
            texto += "<br>";
        }
    }

    return texto;
}

function contarEquiposCategoria(categoria) {
    let total = 0;

    if (!categoria.grupos) {
        return total;
    }

    for (let i = 0; i < categoria.grupos.length; i++) {
        total += categoria.grupos[i].equipos.length;
    }

    return total;
}

function pintarCategorias() {
    const contenedor = document.getElementById("categorias-container");
    contenedor.innerHTML = "";

    if (categorias.length === 0) {
        contenedor.innerHTML = "<p>No hay categorías disponibles.</p>";
        return;
    }

    for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias[i];
        const tarjeta = crearTarjetaCategoria(categoria);
        contenedor.appendChild(tarjeta);
    }
}

function crearTarjetaCategoria(categoria) {
    const enlace = document.createElement("a");
    enlace.href = "cuadrante.html?categoria=" + categoria.slug;
    enlace.className = "cat-card " + categoria.color;

    const emoji = document.createElement("div");
    emoji.className = "cat-emoji";
    emoji.textContent = "⚽";

    const titulo = document.createElement("h3");
    titulo.textContent = categoria.nombre.toUpperCase();

    const texto = document.createElement("p");
    texto.textContent = contarEquiposCategoria(categoria) + " equipos";

    if (categoria.grupos && categoria.grupos.length > 0) {
        texto.textContent += " · " + categoria.grupos.length + " grupos";
    }

    const horario = document.createElement("div");
    horario.className = "cat-time";
    horario.textContent = categoria.horario;

    const boton = document.createElement("div");
    boton.className = "cat-btn";
    boton.textContent = "Ver cuadrante →";

    enlace.appendChild(emoji);
    enlace.appendChild(titulo);
    enlace.appendChild(texto);
    enlace.appendChild(horario);
    enlace.appendChild(boton);

    return enlace;
}

function pintarEquipos() {
    const contenedor = document.getElementById("equipos-container");
    contenedor.innerHTML = "";

    const equipos = obtenerEquiposUnicos();

    if (equipos.length === 0) {
        contenedor.innerHTML = "<p>No hay equipos añadidos.</p>";
        return;
    }

    for (let i = 0; i < equipos.length; i++) {
        const tarjeta = crearTarjetaEquipo(equipos[i], i);
        contenedor.appendChild(tarjeta);
    }
}

function obtenerEquiposUnicos() {
    const equipos = [];

    for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias[i];

        if (categoria.grupos) {
            for (let j = 0; j < categoria.grupos.length; j++) {
                const grupo = categoria.grupos[j];

                for (let k = 0; k < grupo.equipos.length; k++) {
                    const equipo = grupo.equipos[k];

                    if (!equipos.includes(equipo)) {
                        equipos.push(equipo);
                    }
                }
            }
        }
    }

    return equipos;
}

function crearTarjetaEquipo(nombre, indice) {
    const iconos = ["🛡", "⭐", "🏛", "⚡", "🔵", "🌟", "🔴", "💪", "⚽", "🏆"];

    const article = document.createElement("article");
    article.className = "team-card";

    const logo = document.createElement("div");
    logo.className = "team-logo";
    logo.textContent = iconos[indice % iconos.length];

    const nombreEquipo = document.createElement("div");
    nombreEquipo.className = "team-name";
    nombreEquipo.textContent = nombre;

    article.appendChild(logo);
    article.appendChild(nombreEquipo);

    return article;
}

function pintarSorteos() {
    const contenedor = document.getElementById("sorteos-container");
    contenedor.innerHTML = "";

    if (sorteos.length === 0) {
        contenedor.innerHTML = "<p>No hay sorteos añadidos.</p>";
        return;
    }

    for (let i = 0; i < sorteos.length; i++) {
        const sorteo = sorteos[i];
        const tarjeta = crearTarjetaSorteo(sorteo);
        contenedor.appendChild(tarjeta);
    }
}

function crearTarjetaSorteo(sorteo) {
    const article = document.createElement("article");
    article.className = "sorteo-card";

    const icono = document.createElement("div");
    icono.className = "sorteo-icon";

    if (sorteo.imagen && sorteo.imagen !== "") {
        const imagen = document.createElement("img");
        imagen.src = sorteo.imagen;
        imagen.alt = sorteo.titulo;
        icono.appendChild(imagen);
    } else {
        icono.textContent = sorteo.icono || "🎁";
    }

    const titulo = document.createElement("p");
    titulo.textContent = sorteo.titulo;

    article.appendChild(icono);
    article.appendChild(titulo);

    return article;
}

function mostrarErrorInicio() {
    document.getElementById("hero-titulo").textContent = "No se pudo cargar el torneo";
    document.getElementById("hero-subtitulo").textContent = "Revisa el servidor.";
}