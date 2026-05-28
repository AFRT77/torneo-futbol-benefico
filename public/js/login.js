document.addEventListener("DOMContentLoaded", iniciarLogin);

function iniciarLogin() {
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