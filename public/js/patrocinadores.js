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

    for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias[i];

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

    const enlacePatrocinadores = crearEnlaceMenu("🤝 Patrocinadores", "patrocinadores.html", true);
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

    const patrocinadoresValidos = [];

    for (let i = 0; i < patrocinadores.length; i++) {
        const patrocinador = patrocinadores[i];

        if (
            patrocinador.nombre &&
            patrocinador.nombre.trim() !== "" &&
            patrocinador.visible !== false
        ) {
            patrocinadoresValidos.push(patrocinador);
        }
    }

    if (patrocinadoresValidos.length === 0) {
        const mensaje = document.createElement("div");
        mensaje.className = "empty-sponsors";
        mensaje.textContent = "Todavía no hay patrocinadores añadidos.";
        contenedor.appendChild(mensaje);
        return;
    }

    for (let i = 0; i < patrocinadoresValidos.length; i++) {
        const patrocinador = patrocinadoresValidos[i];
        const tarjeta = crearTarjetaPatrocinador(patrocinador);
        contenedor.appendChild(tarjeta);
    }
}

function crearTarjetaPatrocinador(patrocinador) {
    const article = document.createElement("article");
    article.className = "sponsor-card";

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

    const descripcion = document.createElement("p");

    if (patrocinador.descripcion && patrocinador.descripcion.trim() !== "") {
        descripcion.textContent = patrocinador.descripcion;
    } else {
        descripcion.textContent = "Colaborador del torneo";
    }

    article.appendChild(logo);
    article.appendChild(nombre);
    article.appendChild(descripcion);

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