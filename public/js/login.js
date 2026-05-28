let torneo = null;
let categorias = [];

document.addEventListener("DOMContentLoaded", iniciarLogin);

async function iniciarLogin() {
    await cargarDatosLogin();
    pintarLoginDinamico();
    prepararFormularioLogin();
}

async function cargarDatosLogin() {
    try {
        const respuestaTorneo = await fetch("/api/torneo");
        torneo = await respuestaTorneo.json();

        const respuestaCategorias = await fetch("/api/categorias");
        categorias = await respuestaCategorias.json();

    } catch (error) {
        console.log("No se pudieron cargar los datos del login");
        torneo = null;
        categorias = [];
    }
}

function pintarLoginDinamico() {
    if (torneo !== null) {
        const headerLogo = document.querySelector(".header-logo");

        if (headerLogo) {
            headerLogo.innerHTML = "";

            if (torneo.logo && torneo.logo.trim() !== "") {
                const imagen = document.createElement("img");
                imagen.src = torneo.logo;
                imagen.alt = torneo.nombreHeader || "Logo";
                headerLogo.appendChild(imagen);
            } else {
                headerLogo.textContent = "⚽";
            }
        }

        const titulo = document.querySelector(".header-titles h1");

        if (titulo) {
            titulo.innerHTML = torneo.nombreHeader + " <span>" + torneo.nombreDestacado + "</span>";
        }

        const subtitulo = document.querySelector(".header-titles p");

        if (subtitulo) {
            subtitulo.textContent = "Panel de administración";
        }

        const dia = document.querySelector(".header-date .day");

        if (dia) {
            dia.textContent = torneo.dia || "⚙";
        }

        const mes = document.querySelector(".header-date .month");

        if (mes) {
            mes.textContent = torneo.mes || "Admin";
        }

        const footerStrong = document.querySelector("footer strong");

        if (footerStrong) {
            footerStrong.textContent = torneo.nombreHeader + " " + torneo.nombreDestacado + " · " + torneo.club;
        }

        const footerSpan = document.querySelector("footer span");

        if (footerSpan) {
            footerSpan.textContent = "Acceso privado para administradores";
        }
    }

    pintarMenuLogin();
}

function pintarMenuLogin() {
    const navMenu = document.querySelector("nav .nav-inner");

    if (!navMenu) {
        return;
    }

    navMenu.innerHTML = "";

    const enlaceInicio = crearEnlaceMenu("🏠 Inicio", "index.html", false, false);
    navMenu.appendChild(enlaceInicio);

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

    const enlacePatrocinadores = crearEnlaceMenu("🤝 Patrocinadores", "patrocinadores.html", false, false);
    navMenu.appendChild(enlacePatrocinadores);

    const enlaceAdmin = crearEnlaceMenu("⚙ Admin", "login.html", true, true);
    navMenu.appendChild(enlaceAdmin);
}

function crearEnlaceMenu(texto, href, activo, admin) {
    const enlace = document.createElement("a");
    enlace.href = href;

    if (admin) {
        enlace.className = "nav-admin-btn";
    } else {
        enlace.className = "nav-btn";
    }

    if (activo) {
        enlace.className += " active";
    }

    enlace.textContent = texto;

    return enlace;
}

function prepararFormularioLogin() {
    const formulario = document.getElementById("form-login");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        hacerLogin();
    });
}

async function hacerLogin() {
    const password = document.getElementById("password").value;
    const error = document.getElementById("login-error");

    error.style.display = "none";
    error.textContent = "";

    if (password.trim() === "") {
        error.textContent = "Introduce la contraseña.";
        error.style.display = "block";
    } else {
        try {
            const respuesta = await fetch("/api/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password: password
                })
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                localStorage.setItem("tokenAdmin", datos.token);
                window.location.href = "admin.html";
            } else {
                error.textContent = datos.mensaje || "No se ha podido iniciar sesión.";
                error.style.display = "block";
            }

        } catch (err) {
            error.textContent = "Error al conectar con el servidor.";
            error.style.display = "block";
        }
    }
}