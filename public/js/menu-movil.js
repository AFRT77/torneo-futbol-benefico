document.addEventListener("DOMContentLoaded", iniciarMenuMovil);

function iniciarMenuMovil() {
    const botonMenu = document.getElementById("mobile-menu-toggle");
    const nav = document.querySelector("nav");

    if (!botonMenu || !nav) {
        return;
    }

    botonMenu.addEventListener("click", function () {
        nav.classList.toggle("nav-open");

        if (nav.classList.contains("nav-open")) {
            botonMenu.textContent = "✕ Cerrar";
        } else {
            botonMenu.textContent = "☰ Menú";
        }
    });

    document.addEventListener("click", function (evento) {
        const clickDentroMenu = nav.contains(evento.target);

        if (!clickDentroMenu) {
            nav.classList.remove("nav-open");
            botonMenu.textContent = "☰ Menú";
        }
    });

    nav.addEventListener("click", function (evento) {
        if (evento.target.tagName === "A") {
            nav.classList.remove("nav-open");
            botonMenu.textContent = "☰ Menú";
        }
    });
}