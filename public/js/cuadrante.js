let torneo = null;
let categorias = [];
let categoriaActual = null;
let partidos = [];

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {
    await cargarDatos();

    if (torneo === null || categoriaActual === null) {
        mostrarCategoriaNoEncontrada();
    } else {
        pintarDatosGenerales();
        pintarMenu();
        pintarCategoria();
    }
}

async function cargarDatos() {
    const categoriaSlug = obtenerCategoriaDeUrl();

    try {
        const respuestaTorneo = await fetch("/api/torneo");
        torneo = await respuestaTorneo.json();

        const respuestaCategorias = await fetch("/api/categorias");
        categorias = await respuestaCategorias.json();

        const respuestaCategoria = await fetch("/api/categorias/" + categoriaSlug);

        if (!respuestaCategoria.ok) {
            categoriaActual = null;
            return;
        }

        categoriaActual = await respuestaCategoria.json();

        const respuestaPartidos = await fetch("/api/partidos/" + categoriaSlug);
        partidos = await respuestaPartidos.json();

    } catch (error) {
        console.log("Error al cargar los datos");
        console.log(error);
        torneo = null;
        categoriaActual = null;
        partidos = [];
    }
}

function obtenerCategoriaDeUrl() {
    const parametros = new URLSearchParams(window.location.search);
    const categoria = parametros.get("categoria");

    if (categoria === null || categoria === "") {
        return "benjamin";
    }

    return categoria;
}

function pintarDatosGenerales() {
    const headerLogo = document.getElementById("header-logo");

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
        torneo.nombreHeader + " " + torneo.nombreDestacado + " · " + torneo.club + " · " + torneo.causaCompleta + " · " + torneo.fechaTexto;

    document.getElementById("footer-subtitulo").textContent = torneo.footerTexto;
}

function pintarMenu() {
    const navMenu = document.getElementById("nav-menu");
    navMenu.innerHTML = "";

    const categoriaSlug = obtenerCategoriaDeUrl();

    const enlaceInicio = crearEnlaceMenu("🏠 Inicio", "index.html", false);
    navMenu.appendChild(enlaceInicio);

    for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias[i];

        if (categoria.visible === false) {
            continue;
        }

        const activo = categoria.slug === categoriaSlug;

        const enlace = document.createElement("a");
        enlace.href = "cuadrante.html?categoria=" + categoria.slug;
        enlace.className = "nav-btn";

        if (activo) {
            enlace.className = "nav-btn active";
        }

        const texto = document.createTextNode("Cuadrante ");
        enlace.appendChild(texto);

        const span = document.createElement("span");
        span.className = "nav-cat " + (categoria.color || "benjamin");

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

function pintarCategoria() {
    document.title = "Cuadrante " + categoriaActual.nombre + " - Torneo";

    const titulo = document.getElementById("categoria-titulo");
    titulo.textContent = "CATEGORÍA " + categoriaActual.nombre.toUpperCase();
    titulo.className = (categoriaActual.color || "benjamin") + "-color";

    document.getElementById("categoria-subtitulo").textContent =
        torneo.nombreHeader + " " + torneo.nombreDestacado + " · " + torneo.club + " · " + torneo.fechaTexto;

    const horario = document.getElementById("categoria-horario");
    horario.textContent = categoriaActual.horario;
    horario.className = "bracket-badge " + (categoriaActual.color || "benjamin");

    pintarEquipos();
    pintarGrupos();
    pintarPartidosGrupo();
    pintarEliminatorias();
    pintarFinal();
    pintarTrofeos();
}

function pintarEquipos() {
    const contenedor = document.getElementById("equipos-row");
    contenedor.innerHTML = "";

    for (let i = 0; i < categoriaActual.grupos.length; i++) {
        const grupo = categoriaActual.grupos[i];

        for (let j = 0; j < grupo.equipos.length; j++) {
            const div = document.createElement("div");
            div.className = "team-pill";

            const punto = document.createElement("span");
            punto.className = "dot";

            const texto = document.createTextNode(grupo.equipos[j]);

            div.appendChild(punto);
            div.appendChild(texto);

            contenedor.appendChild(div);
        }
    }
}

function pintarGrupos() {
    const contenedor = document.getElementById("grupos-grid");
    contenedor.innerHTML = "";

    for (let i = 0; i < categoriaActual.grupos.length; i++) {
        const grupo = categoriaActual.grupos[i];

        const article = document.createElement("article");
        article.className = "group-block";

        const header = document.createElement("div");

        if (i % 2 === 0) {
            header.className = "group-header grupo-a";
            header.textContent = "⚽ " + grupo.nombre;
        } else {
            header.className = "group-header grupo-b";
            header.textContent = "⭐ " + grupo.nombre;
        }

        article.appendChild(header);

        for (let j = 0; j < grupo.equipos.length; j++) {
            const equipo = document.createElement("div");
            equipo.className = "group-team";

            const punto = document.createElement("span");
            punto.className = "mini-dot";

            const texto = document.createTextNode(grupo.equipos[j]);

            equipo.appendChild(punto);
            equipo.appendChild(texto);

            article.appendChild(equipo);
        }

        contenedor.appendChild(article);
    }
}

function pintarPartidosGrupo() {
    const contenedor = document.getElementById("partidos-grupo");
    contenedor.innerHTML = "";

    const campos = obtenerCamposDePartidosGrupo();

    for (let i = 0; i < campos.length; i++) {
        const campo = campos[i];

        const section = document.createElement("section");
        section.className = "field-section";

        const label = document.createElement("div");

        if (i % 2 === 0) {
            label.className = "field-label chutapp";
            label.textContent = "⚽ " + campo;
        } else {
            label.className = "field-label quazzartech";
            label.textContent = "🏟 " + campo;
        }

        section.appendChild(label);

        const tabla = crearTablaPartidos();

        for (let j = 0; j < partidos.length; j++) {
            const partido = partidos[j];

            if (partido.tipo === "grupo" && partido.campo === campo) {
                const fila = crearFilaPartido(partido);
                tabla.querySelector("tbody").appendChild(fila);
            }
        }

        section.appendChild(tabla);
        contenedor.appendChild(section);
    }
}

function obtenerCamposDePartidosGrupo() {
    const campos = [];

    for (let i = 0; i < partidos.length; i++) {
        const partido = partidos[i];

        if (partido.tipo === "grupo") {
            let existe = false;

            for (let j = 0; j < campos.length; j++) {
                if (campos[j] === partido.campo) {
                    existe = true;
                }
            }

            if (!existe) {
                campos.push(partido.campo);
            }
        }
    }

    return campos;
}

function crearTablaPartidos() {
    const tabla = document.createElement("table");
    tabla.className = "matches-table";

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");

    const thPartido = document.createElement("th");
    thPartido.textContent = "Partido";

    const thHora = document.createElement("th");
    thHora.textContent = "Hora";

    const thResultado = document.createElement("th");
    thResultado.textContent = "Resultado";

    trHead.appendChild(thPartido);
    trHead.appendChild(thHora);
    trHead.appendChild(thResultado);

    thead.appendChild(trHead);

    const tbody = document.createElement("tbody");

    tabla.appendChild(thead);
    tabla.appendChild(tbody);

    return tabla;
}

function crearFilaPartido(partido) {
    const tr = document.createElement("tr");

    const tdPartido = document.createElement("td");
    const spanPartido = document.createElement("span");
    spanPartido.className = "match-teams";

    const local = document.createTextNode(partido.equipoLocal + " ");
    const vs = document.createElement("span");
    vs.className = "match-vs";
    vs.textContent = "vs";
    const visitante = document.createTextNode(" " + partido.equipoVisitante);

    spanPartido.appendChild(local);
    spanPartido.appendChild(vs);
    spanPartido.appendChild(visitante);

    tdPartido.appendChild(spanPartido);

    const tdHora = document.createElement("td");
    tdHora.className = "match-time";
    tdHora.textContent = partido.hora;

    const tdResultado = document.createElement("td");
    tdResultado.className = "match-result";

    if (partido.resultado === "") {
        tdResultado.textContent = "- : -";
    } else {
        tdResultado.textContent = partido.resultado;
    }

    tr.appendChild(tdPartido);
    tr.appendChild(tdHora);
    tr.appendChild(tdResultado);

    return tr;
}

function pintarEliminatorias() {
    const contenedor = document.getElementById("partidos-eliminatoria");
    contenedor.innerHTML = "";

    for (let i = 0; i < partidos.length; i++) {
        const partido = partidos[i];

        if (partido.tipo === "eliminatoria") {
            const bloque = crearBloqueEliminatoria(partido);
            contenedor.appendChild(bloque);
        }
    }
}

function crearBloqueEliminatoria(partido) {
    const article = document.createElement("article");
    article.className = "ko-block";

    const header = document.createElement("div");
    header.className = "ko-header semifinal";

    if (partido.fase.includes("3º")) {
        header.className = "ko-header tercero";
    }

    if (partido.fase.includes("5º")) {
        header.className = "ko-header quinto";
    }

    const fase = document.createElement("span");
    fase.textContent = partido.fase + " · " + partido.campo;

    const hora = document.createElement("span");
    hora.textContent = partido.hora;

    header.appendChild(fase);
    header.appendChild(hora);

    const match = document.createElement("div");
    match.className = "ko-match";

    const local = document.createElement("span");
    local.className = "ko-team";
    local.textContent = partido.equipoLocal;

    const vs = document.createElement("span");
    vs.className = "ko-vs";
    vs.textContent = "vs";

    const visitante = document.createElement("span");
    visitante.className = "ko-team";
    visitante.textContent = partido.equipoVisitante;

    const resultado = document.createElement("span");
    resultado.className = "ko-result";
    resultado.textContent = partido.resultado;

    match.appendChild(local);
    match.appendChild(vs);
    match.appendChild(visitante);
    match.appendChild(resultado);

    article.appendChild(header);
    article.appendChild(match);

    return article;
}

function pintarFinal() {
    const contenedor = document.getElementById("final-container");
    contenedor.innerHTML = "";

    let final = null;

    for (let i = 0; i < partidos.length; i++) {
        if (partidos[i].tipo === "final") {
            final = partidos[i];
        }
    }

    if (final === null) {
        return;
    }

    const section = document.createElement("section");
    section.className = "final-block";

    const header = document.createElement("div");
    header.className = "final-header";

    const titulo = document.createElement("span");
    titulo.textContent = "🏆 " + final.fase.toUpperCase();

    const campo = document.createElement("span");
    campo.className = "field-tag";
    campo.textContent = final.campo;

    header.appendChild(titulo);
    header.appendChild(campo);

    const match = document.createElement("div");
    match.className = "final-match";

    const local = document.createElement("span");
    local.className = "final-team";
    local.textContent = final.equipoLocal;

    const vs = document.createElement("span");
    vs.className = "final-vs";
    vs.textContent = "vs";

    const visitante = document.createElement("span");
    visitante.className = "final-team";
    visitante.textContent = final.equipoVisitante;

    const hora = document.createElement("span");
    hora.className = "final-time";
    hora.textContent = final.hora;

    const resultado = document.createElement("span");
    resultado.className = "final-result";
    resultado.textContent = final.resultado;

    match.appendChild(local);
    match.appendChild(vs);
    match.appendChild(visitante);
    match.appendChild(hora);
    match.appendChild(resultado);

    section.appendChild(header);
    section.appendChild(match);

    contenedor.appendChild(section);
}

function pintarTrofeos() {
    document.getElementById("trofeos-bar").textContent = categoriaActual.trofeos;
}

function mostrarCategoriaNoEncontrada() {
    document.getElementById("categoria-titulo").textContent = "Categoría no encontrada";
    document.getElementById("categoria-subtitulo").textContent = "Revisa la URL o vuelve al inicio.";
    document.getElementById("categoria-horario").textContent = "";

    document.getElementById("equipos-row").innerHTML = "";
    document.getElementById("grupos-grid").innerHTML = "";
    document.getElementById("partidos-grupo").innerHTML = "";
    document.getElementById("partidos-eliminatoria").innerHTML = "";
    document.getElementById("final-container").innerHTML = "";
    document.getElementById("trofeos-bar").textContent = "";
}