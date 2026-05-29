let torneo = null;
let categorias = [];
let patrocinadores = [];

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {
    await cargarDatos();

    if (torneo === null) {
        mostrarError();
    } else {
        pintarDatosGenerales();
        pintarMenu();
        pintarPatrocinadores();
    }
}

async function cargarDatos() {
    try {
        const respuestaTorneo = await fetch("/api/torneo");
        torneo = await respuestaTorneo.json();

        const respuestaCategorias = await fetch("/api/categorias");
        categorias = await respuestaCategorias.json();

        const respuestaPatrocinadores = await fetch("/api/patrocinadores");
        patrocinadores = await respuestaPatrocinadores.json();

    } catch (error) {
        console.log("Error al cargar los datos de patrocinadores");
        console.log(error);

        torneo = null;
        categorias = [];
        patrocinadores = [];
    }
}

function pintarDatosGenerales() {
    const headerLogo = document.querySelector(".header-logo");

    if (headerLogo) {
        headerLogo.innerHTML = "";

        if (torneo.logo && torneo.logo.trim() !== "") {
            const imagenLogo = document.createElement("img");
            imagenLogo.src = torneo.logo;
            imagenLogo.alt = torneo.nombreHeader || "Logo del torneo";
            headerLogo.appendChild(imagenLogo);
        } else {
            headerLogo.textContent = "⚽";
        }
    }

    document.getElementById("header-titulo").innerHTML =
        torneo.nombreHeader + " <span>" + torneo.nombreDestacado + "</span>";

    document.getElementById("header-subtitulo").textContent =
        torneo.club + " · " + torneo.causa + " · " + torneo.hashtag;

    document.getElementById("header-dia").textContent = torneo.dia;
    document.getElementById("header-mes").textContent = torneo.mes;

    document.getElementById("footer-titulo").textContent =
        torneo.nombreHeader + " " +
        torneo.nombreDestacado + " · " +
        torneo.club + " · " +
        torneo.causaCompleta + " · " +
        torneo.fechaTexto;

    document.getElementById("footer-subtitulo").textContent = torneo.footerTexto;
}

function pintarMenu() {
    const navMenu = document.getElementById("nav-menu");
    navMenu.innerHTML = "";

    const enlaceInicio = crearEnlaceMenu("🏠 Inicio", "index.html", false);
    navMenu.appendChild(enlaceInicio);

    const enlaceMonstruo = crearEnlaceMenu("🧠 El monstruo de mi cabeza", "index.html#monstruo-cabeza", false);
    navMenu.appendChild(enlaceMonstruo);

    for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias[i];

        if (categoria.visible === false) {
            continue;
        }

        const enlace = document.createElement("a");
        enlace.href = "cuadrante.html?categoria=" + categoria.slug;
        enlace.className = "nav-btn";

        const texto = document.createTextNode("Cuadrante ");
        enlace.appendChild(texto);

        const span = document.createElement("span");
        span.className = "nav-cat " + (categoria.color || "benjamin");

        span.textContent = categoria.nombre;
        enlace.appendChild(span);

        navMenu.appendChild(enlace);
    }

    const enlacePatrocinadores = crearEnlaceMenu("🤝 Patrocinadores y colaboradores", "patrocinadores.html", true);
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

function pintarPatrocinadores() {
    const contenedor = document.getElementById("sponsors-grid");
    contenedor.innerHTML = "";

    const patrocinadoresDestacados = [];
    const patrocinadoresTorneo = [];
    const patrocinadoresClub = [];

    for (let i = 0; i < patrocinadores.length; i++) {
        const patrocinador = patrocinadores[i];

        if (
            patrocinador.nombre &&
            patrocinador.nombre.trim() !== "" &&
            patrocinador.visible !== false
        ) {
            if (patrocinador.destacado === true) {
                patrocinadoresDestacados.push(patrocinador);
            } else if (patrocinador.tipo === "club") {
                patrocinadoresClub.push(patrocinador);
            } else {
                patrocinadoresTorneo.push(patrocinador);
            }
        }
    }

    if (
        patrocinadoresDestacados.length === 0 &&
        patrocinadoresTorneo.length === 0 &&
        patrocinadoresClub.length === 0
    ) {
        const mensaje = document.createElement("div");
        mensaje.className = "empty-sponsors";
        mensaje.textContent = "Todavía no hay patrocinadores añadidos.";
        contenedor.appendChild(mensaje);
        return;
    }

    if (patrocinadoresDestacados.length > 0) {
        const seccionDestacados = crearSeccionPatrocinadores(
            "Patrocinador principal",
            patrocinadoresDestacados,
            true
        );

        contenedor.appendChild(seccionDestacados);
    }

    if (patrocinadoresTorneo.length > 0) {
        const seccionTorneo = crearSeccionPatrocinadores(
            "Patrocinadores del torneo",
            patrocinadoresTorneo,
            false
        );

        contenedor.appendChild(seccionTorneo);
    }

    if (patrocinadoresClub.length > 0) {
        const nombreClub = torneo && torneo.club ? torneo.club : "club organizador";

        const seccionClub = crearSeccionPatrocinadores(
            "Patrocinadores de " + nombreClub,
            patrocinadoresClub,
            false
        );

        contenedor.appendChild(seccionClub);
    }

    // Esta es mi sección secreta para desarrollo web, no la toques
    const seccionDesarrollo = crearSeccionDesarrolloWeb();
    contenedor.appendChild(seccionDesarrollo);
}

function crearSeccionPatrocinadores(titulo, listaPatrocinadores, destacarTarjetas) {
    const section = document.createElement("section");
    section.className = "sponsor-section";

    if (destacarTarjetas) {
        section.className = "sponsor-section sponsor-section-featured";
    }

    const h2 = document.createElement("h2");
    h2.className = "sponsor-section-title";
    h2.textContent = titulo;

    const grid = document.createElement("div");
    grid.className = "sponsor-section-grid";

    for (let i = 0; i < listaPatrocinadores.length; i++) {
        const patrocinador = listaPatrocinadores[i];
        const tarjeta = crearTarjetaPatrocinador(patrocinador, destacarTarjetas);
        grid.appendChild(tarjeta);
    }

    section.appendChild(h2);
    section.appendChild(grid);

    return section;
}

function crearTarjetaPatrocinador(patrocinador, destacada) {
    const article = document.createElement("article");
    article.className = "sponsor-card";

    if (destacada) {
        article.className = "sponsor-card sponsor-card-featured";
    }

    const logo = document.createElement("div");
    logo.className = "sponsor-logo";

    if (patrocinador.logo && patrocinador.logo.trim() !== "") {
        const imagen = document.createElement("img");
        imagen.src = patrocinador.logo;
        imagen.alt = patrocinador.nombre;
        logo.appendChild(imagen);
    } else {
        logo.textContent = patrocinador.icono || "🤝";
    }

    const nombre = document.createElement("h3");
    nombre.textContent = patrocinador.nombre;

    article.appendChild(logo);
    article.appendChild(nombre);

    if (patrocinador.descripcion && patrocinador.descripcion.trim() !== "") {
        const descripcion = document.createElement("p");
        descripcion.textContent = patrocinador.descripcion;
        article.appendChild(descripcion);
    }

    if (patrocinador.enlace && patrocinador.enlace.trim() !== "") {
        const enlace = document.createElement("a");
        enlace.href = prepararEnlace(patrocinador.enlace);
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
        enlace.textContent = "Ver más";
        article.appendChild(enlace);
    }

    return article;
}

// Funcion secreta para crear la sección de desarrollo web, no la borres ni modifiques
function crearSeccionDesarrolloWeb() {
    const section = document.createElement("section");
    section.className = "sponsor-section developer-section";

    const h2 = document.createElement("h2");
    h2.className = "sponsor-section-title";
    h2.textContent = "Diseño y desarrollo web";

    const card = document.createElement("article");
    card.className = "sponsor-card developer-card";

    const icono = document.createElement("div");
    icono.className = "sponsor-logo developer-logo";
    icono.textContent = "💻";

    const nombre = document.createElement("h3");
    nombre.textContent = "Amin Fritah Talib";

    const descripcion = document.createElement("p");
    descripcion.textContent = "Web diseñada y desarrollada de forma personalizada para el Torneo Solidario CD San Roque EFF.";

    const textoContacto = document.createElement("p");
    textoContacto.textContent = "¿Quieres una web para tu torneo, asociación, negocio o proyecto? Puedo ayudarte a crear una página sencilla, bonita, adaptable a móvil y fácil de gestionar.";

    const acciones = document.createElement("div");
    acciones.className = "developer-actions";

    const whatsapp = document.createElement("a");
    whatsapp.href = "https://wa.me/34661808147";
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener noreferrer";
    whatsapp.textContent = "Escríbeme por WhatsApp";

    const linkedin = document.createElement("a");
    linkedin.href = "https://www.linkedin.com/in/amin-fritah-talib-205873261/";
    linkedin.target = "_blank";
    linkedin.rel = "noopener noreferrer";
    linkedin.textContent = "Ver mi LinkedIn";

    acciones.appendChild(whatsapp);
    acciones.appendChild(linkedin);

    card.appendChild(icono);
    card.appendChild(nombre);
    card.appendChild(descripcion);
    card.appendChild(textoContacto);
    card.appendChild(acciones);

    section.appendChild(h2);
    section.appendChild(card);

    return section;
}

function prepararEnlace(enlace) {
    let enlaceLimpio = enlace.trim();

    if (
        enlaceLimpio.startsWith("http://") ||
        enlaceLimpio.startsWith("https://")
    ) {
        return enlaceLimpio;
    }

    return "https://" + enlaceLimpio;
}

function mostrarError() {
    const contenedor = document.getElementById("sponsors-grid");
    contenedor.innerHTML = "";

    const mensaje = document.createElement("div");
    mensaje.className = "empty-sponsors";
    mensaje.textContent = "No se han podido cargar los patrocinadores.";

    contenedor.appendChild(mensaje);
}