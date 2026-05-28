let torneoActual = null;
let categoriasAdmin = [];
let partidosAdmin = [];
let patrocinadoresAdmin = [];
let sorteosAdmin = [];

document.addEventListener("DOMContentLoaded", iniciarAdmin);

async function iniciarAdmin() {
    protegerPaginaAdmin();
    prepararTabs();
    prepararLogout();
    prepararGuardar();
    prepararBotones();

    await cargarDatosGenerales();
    await cargarCategoriasAdmin();
    await cargarPartidosAdmin();
    await cargarPatrocinadoresAdmin();
    await cargarSorteosAdmin();
}

function protegerPaginaAdmin() {
    const token = localStorage.getItem("tokenAdmin");

    if (!token) {
        window.location.href = "login.html";
    }
}

function prepararTabs() {
    const botonesTabs = document.querySelectorAll(".admin-tab");

    for (let i = 0; i < botonesTabs.length; i++) {
        botonesTabs[i].addEventListener("click", function () {
            const tab = this.dataset.tab;
            cambiarTab(tab);
        });
    }
}

function cambiarTab(tab) {
    const botonesTabs = document.querySelectorAll(".admin-tab");
    const secciones = document.querySelectorAll(".admin-section");

    for (let i = 0; i < botonesTabs.length; i++) {
        botonesTabs[i].classList.remove("active");
    }

    for (let i = 0; i < secciones.length; i++) {
        secciones[i].classList.remove("active");
    }

    const botonActivo = document.querySelector('.admin-tab[data-tab="' + tab + '"]');
    const seccionActiva = document.getElementById("tab-" + tab);

    if (botonActivo) {
        botonActivo.classList.add("active");
    }

    if (seccionActiva) {
        seccionActiva.classList.add("active");
    }
}

function prepararLogout() {
    const botonLogout = document.getElementById("btn-logout");

    botonLogout.addEventListener("click", function () {
        localStorage.removeItem("tokenAdmin");
        window.location.href = "login.html";
    });
}

function prepararGuardar() {
    const botonGuardar = document.getElementById("btn-save");

    botonGuardar.addEventListener("click", async function () {
        const tabActiva = document.querySelector(".admin-tab.active").dataset.tab;

        if (tabActiva === "general") {
            await guardarDatosGenerales();
        } else if (tabActiva === "categorias") {
            await guardarCategorias();
        } else if (tabActiva === "partidos") {
            await guardarPartidos();
        } else if (tabActiva === "patrocinadores") {
            await guardarPatrocinadores();
        } else if (tabActiva === "sorteos") {
            await guardarSorteos();
        } else {
            mostrarMensaje("Esta sección todavía no está conectada al backend.", "error");
        }
    });
}

function prepararBotones() {
    const botonAddCategoria = document.getElementById("btn-add-categoria");

    if (botonAddCategoria) {
        botonAddCategoria.addEventListener("click", function () {
            agregarCategoriaTemporal();
        });
    }

    const botonAddPartido = document.getElementById("btn-add-partido");

    if (botonAddPartido) {
        botonAddPartido.addEventListener("click", function () {
            agregarPartidoTemporal();
        });
    }

    const botonAddPatrocinador = document.getElementById("btn-add-patrocinador");

    if (botonAddPatrocinador) {
        botonAddPatrocinador.addEventListener("click", function () {
            agregarPatrocinadorTemporal();
        });
    }

    const botonAddSorteo = document.getElementById("btn-add-sorteo");

    if (botonAddSorteo) {
        botonAddSorteo.addEventListener("click", function () {
            agregarSorteoTemporal();
        });
    }

    const filtroPartidos = document.getElementById("filtro-categoria-partidos");

    if (filtroPartidos) {
        filtroPartidos.addEventListener("change", function () {
            pintarPartidosAdmin();
        });
    }
}

/* DATOS GENERALES */

async function cargarDatosGenerales() {
    try {
        const respuesta = await fetch("/api/torneo");
        const datos = await respuesta.json();

        torneoActual = datos;

        document.getElementById("nombreHeader").value = datos.nombreHeader || "";
        document.getElementById("nombreDestacado").value = datos.nombreDestacado || "";
        document.getElementById("club").value = datos.club || "";
        document.getElementById("causa").value = datos.causa || "";
        document.getElementById("causaCompleta").value = datos.causaCompleta || "";
        document.getElementById("hashtag").value = datos.hashtag || "";
        document.getElementById("fechaTexto").value = datos.fechaTexto || "";
        document.getElementById("dia").value = datos.dia || "";
        document.getElementById("mes").value = datos.mes || "";
        document.getElementById("lugar").value = datos.lugar || "";
        document.getElementById("ciudad").value = datos.ciudad || "";
        document.getElementById("descripcion").value = datos.descripcion || "";
        document.getElementById("footerTexto").value = datos.footerTexto || "";
        document.getElementById("logo").value = datos.logo || "";
        document.getElementById("imagenPrincipal").value = datos.imagenPrincipal || "";

    } catch (error) {
        mostrarMensaje("No se han podido cargar los datos generales.", "error");
    }
}

async function guardarDatosGenerales() {
    const token = localStorage.getItem("tokenAdmin");

    const datos = {
        nombreHeader: document.getElementById("nombreHeader").value,
        nombreDestacado: document.getElementById("nombreDestacado").value,
        club: document.getElementById("club").value,
        causa: document.getElementById("causa").value,
        causaCompleta: document.getElementById("causaCompleta").value,
        hashtag: document.getElementById("hashtag").value,
        fechaTexto: document.getElementById("fechaTexto").value,
        dia: document.getElementById("dia").value,
        mes: document.getElementById("mes").value,
        lugar: document.getElementById("lugar").value,
        ciudad: document.getElementById("ciudad").value,
        descripcion: document.getElementById("descripcion").value,
        footerTexto: document.getElementById("footerTexto").value,
        logo: document.getElementById("logo").value,
        imagenPrincipal: document.getElementById("imagenPrincipal").value,
        activo: true
    };

    try {
        const respuesta = await fetch("/api/torneo", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            mostrarMensaje("Datos generales guardados correctamente.", "success");
        } else {
            mostrarMensaje(resultado.mensaje || "No se han podido guardar los datos.", "error");
        }

    } catch (error) {
        mostrarMensaje("Error al conectar con el servidor.", "error");
    }
}

/* CATEGORÍAS */

async function cargarCategoriasAdmin() {
    const token = localStorage.getItem("tokenAdmin");

    try {
        const respuesta = await fetch("/api/categorias/admin/todas", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        categoriasAdmin = await respuesta.json();

        pintarCategoriasAdmin();
        pintarFiltroCategoriasPartidos();

    } catch (error) {
        mostrarMensaje("No se han podido cargar las categorías.", "error");
    }
}

function pintarCategoriasAdmin() {
    const contenedor = document.getElementById("categorias-admin-lista");
    contenedor.innerHTML = "";

    if (categoriasAdmin.length === 0) {
        contenedor.innerHTML = `
      <div class="empty-admin-box">
        No hay categorías añadidas.
      </div>
    `;
        return;
    }

    for (let i = 0; i < categoriasAdmin.length; i++) {
        const categoria = categoriasAdmin[i];

        const fila = document.createElement("div");
        fila.className = "category-admin-card";

        fila.innerHTML = `
      <div class="form-grid">
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" value="${categoria.nombre || ""}" data-campo="nombre" data-index="${i}">
        </div>

        <div class="form-group">
          <label>Slug</label>
          <input type="text" value="${categoria.slug || ""}" data-campo="slug" data-index="${i}">
        </div>

        <div class="form-group">
          <label>Color</label>
          <input type="text" value="${categoria.color || ""}" data-campo="color" data-index="${i}">
        </div>

        <div class="form-group">
          <label>Horario</label>
          <input type="text" value="${categoria.horario || ""}" data-campo="horario" data-index="${i}">
        </div>

        <div class="form-group">
          <label>Orden</label>
          <input type="number" value="${categoria.orden || 0}" data-campo="orden" data-index="${i}">
        </div>

        <div class="form-group">
          <label>Visible</label>
          <select data-campo="visible" data-index="${i}">
            <option value="true" ${categoria.visible === true ? "selected" : ""}>Sí</option>
            <option value="false" ${categoria.visible === false ? "selected" : ""}>No</option>
          </select>
        </div>

        <div class="form-group form-group-full">
          <label>Entrega de trofeos</label>
          <input type="text" value="${categoria.trofeos || ""}" data-campo="trofeos" data-index="${i}">
        </div>

        <div class="form-group form-group-full">
          <label>Grupos y equipos</label>
          <textarea data-campo="grupos" data-index="${i}">${convertirGruposATexto(categoria.grupos)}</textarea>
          <small>Formato: Grupo A: Equipo 1, Equipo 2, Equipo 3</small>
        </div>
      </div>

      <button class="btn-mini-danger btn-eliminar-categoria" type="button" data-index="${i}">
        Eliminar categoría
      </button>
    `;

        contenedor.appendChild(fila);
    }

    prepararInputsCategorias();
}

function prepararInputsCategorias() {
    const inputs = document.querySelectorAll("#categorias-admin-lista input, #categorias-admin-lista textarea, #categorias-admin-lista select");

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("input", actualizarCategoriaDesdeInput);
        inputs[i].addEventListener("change", actualizarCategoriaDesdeInput);
    }

    const botonesEliminar = document.querySelectorAll(".btn-eliminar-categoria");

    for (let i = 0; i < botonesEliminar.length; i++) {
        botonesEliminar[i].addEventListener("click", function () {
            const index = Number(this.dataset.index);
            eliminarCategoria(index);
        });
    }
}

function actualizarCategoriaDesdeInput() {
    const index = Number(this.dataset.index);
    const campo = this.dataset.campo;
    let valor = this.value;

    if (campo === "orden") {
        valor = Number(valor);
    }

    if (campo === "visible") {
        valor = valor === "true";
    }

    if (campo === "grupos") {
        valor = convertirTextoAGrupos(valor);
    }

    categoriasAdmin[index][campo] = valor;

    if (campo === "nombre" || campo === "slug") {
        pintarFiltroCategoriasPartidos();
    }
}

function convertirGruposATexto(grupos) {
    if (!grupos || grupos.length === 0) {
        return "";
    }

    let texto = "";

    for (let i = 0; i < grupos.length; i++) {
        texto += grupos[i].nombre + ": ";

        for (let j = 0; j < grupos[i].equipos.length; j++) {
            texto += grupos[i].equipos[j];

            if (j < grupos[i].equipos.length - 1) {
                texto += ", ";
            }
        }

        if (i < grupos.length - 1) {
            texto += "\n";
        }
    }

    return texto;
}

function convertirTextoAGrupos(texto) {
    const lineas = texto.split("\n");
    const grupos = [];

    for (let i = 0; i < lineas.length; i++) {
        const linea = lineas[i].trim();

        if (linea !== "") {
            const partes = linea.split(":");

            if (partes.length >= 2) {
                const nombreGrupo = partes[0].trim();
                const equiposTexto = partes.slice(1).join(":").trim();
                const equiposSeparados = equiposTexto.split(",");
                const equipos = [];

                for (let j = 0; j < equiposSeparados.length; j++) {
                    const equipo = equiposSeparados[j].trim();

                    if (equipo !== "") {
                        equipos.push(equipo);
                    }
                }

                grupos.push({
                    nombre: nombreGrupo,
                    equipos: equipos
                });
            }
        }
    }

    return grupos;
}

function agregarCategoriaTemporal() {
    categoriasAdmin.push({
        nombre: "Nueva categoría",
        slug: "nueva-categoria",
        color: "benjamin",
        horario: "",
        trofeos: "",
        grupos: [
            {
                nombre: "Grupo A",
                equipos: []
            }
        ],
        orden: categoriasAdmin.length + 1,
        visible: true
    });

    pintarCategoriasAdmin();
    pintarFiltroCategoriasPartidos();
}

async function eliminarCategoria(index) {
    const categoria = categoriasAdmin[index];

    if (!confirm("¿Seguro que quieres eliminar esta categoría?")) {
        return;
    }

    if (!categoria._id) {
        categoriasAdmin.splice(index, 1);
        pintarCategoriasAdmin();
        pintarFiltroCategoriasPartidos();
        return;
    }

    const token = localStorage.getItem("tokenAdmin");

    try {
        const respuesta = await fetch("/api/categorias/" + categoria._id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            categoriasAdmin.splice(index, 1);
            pintarCategoriasAdmin();
            pintarFiltroCategoriasPartidos();
            mostrarMensaje("Categoría eliminada correctamente.", "success");
        } else {
            mostrarMensaje(resultado.mensaje || "No se ha podido eliminar la categoría.", "error");
        }

    } catch (error) {
        mostrarMensaje("Error al conectar con el servidor.", "error");
    }
}

async function guardarCategorias() {
    const token = localStorage.getItem("tokenAdmin");

    try {
        for (let i = 0; i < categoriasAdmin.length; i++) {
            const categoria = categoriasAdmin[i];

            if (categoria._id) {
                await fetch("/api/categorias/" + categoria._id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(categoria)
                });
            } else {
                await fetch("/api/categorias", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(categoria)
                });
            }
        }

        mostrarMensaje("Categorías guardadas correctamente.", "success");
        await cargarCategoriasAdmin();

    } catch (error) {
        mostrarMensaje("Error al guardar las categorías.", "error");
    }
}

/* PARTIDOS */

async function cargarPartidosAdmin() {
    const token = localStorage.getItem("tokenAdmin");

    try {
        const respuesta = await fetch("/api/partidos/admin/todos", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        partidosAdmin = await respuesta.json();

        pintarFiltroCategoriasPartidos();
        pintarPartidosAdmin();

    } catch (error) {
        mostrarMensaje("No se han podido cargar los partidos.", "error");
    }
}

function pintarFiltroCategoriasPartidos() {
    const filtro = document.getElementById("filtro-categoria-partidos");

    if (!filtro) {
        return;
    }

    const valorActual = filtro.value;

    filtro.innerHTML = "";

    const opcionTodas = document.createElement("option");
    opcionTodas.value = "";
    opcionTodas.textContent = "Todas las categorías";
    filtro.appendChild(opcionTodas);

    for (let i = 0; i < categoriasAdmin.length; i++) {
        const categoria = categoriasAdmin[i];

        const option = document.createElement("option");
        option.value = categoria.slug;
        option.textContent = categoria.nombre;

        filtro.appendChild(option);
    }

    filtro.value = valorActual;
}

function pintarPartidosAdmin() {
    const contenedor = document.getElementById("partidos-admin-lista");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    const filtro = document.getElementById("filtro-categoria-partidos");
    let categoriaFiltro = "";

    if (filtro) {
        categoriaFiltro = filtro.value;
    }

    let contador = 0;

    for (let i = 0; i < partidosAdmin.length; i++) {
        const partido = partidosAdmin[i];

        if (categoriaFiltro === "" || partido.categoria === categoriaFiltro) {
            const tarjeta = crearTarjetaPartido(partido, i);
            contenedor.appendChild(tarjeta);
            contador++;
        }
    }

    if (contador === 0) {
        contenedor.innerHTML = `
      <div class="empty-admin-box">
        No hay partidos para mostrar.
      </div>
    `;
    }

    prepararInputsPartidos();
}

function crearTarjetaPartido(partido, index) {
    const div = document.createElement("div");
    div.className = "partido-admin-card";

    div.innerHTML = `
    <div class="partido-admin-title">
      <strong>${partido.categoria || "Sin categoría"} · ${partido.fase || "Sin fase"}</strong>
      <span>${partido.equipoLocal || "Local"} vs ${partido.equipoVisitante || "Visitante"}</span>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Categoría</label>
        <input type="text" value="${partido.categoria || ""}" data-campo="categoria" data-index="${index}">
      </div>

      <div class="form-group">
        <label>Tipo</label>
        <select data-campo="tipo" data-index="${index}">
          <option value="grupo" ${partido.tipo === "grupo" ? "selected" : ""}>Grupo</option>
          <option value="eliminatoria" ${partido.tipo === "eliminatoria" ? "selected" : ""}>Eliminatoria</option>
          <option value="final" ${partido.tipo === "final" ? "selected" : ""}>Final</option>
        </select>
      </div>

      <div class="form-group">
        <label>Fase</label>
        <input type="text" value="${partido.fase || ""}" data-campo="fase" data-index="${index}">
      </div>

      <div class="form-group">
        <label>Grupo</label>
        <input type="text" value="${partido.grupo || ""}" data-campo="grupo" data-index="${index}">
      </div>

      <div class="form-group">
        <label>Campo</label>
        <input type="text" value="${partido.campo || ""}" data-campo="campo" data-index="${index}">
      </div>

      <div class="form-group">
        <label>Equipo local</label>
        <input type="text" value="${partido.equipoLocal || ""}" data-campo="equipoLocal" data-index="${index}">
      </div>

      <div class="form-group">
        <label>Equipo visitante</label>
        <input type="text" value="${partido.equipoVisitante || ""}" data-campo="equipoVisitante" data-index="${index}">
      </div>

      <div class="form-group">
        <label>Hora</label>
        <input type="text" value="${partido.hora || ""}" data-campo="hora" data-index="${index}">
      </div>

      <div class="form-group">
        <label>Resultado</label>
        <input type="text" value="${partido.resultado || ""}" data-campo="resultado" data-index="${index}">
      </div>

      <div class="form-group">
        <label>Orden</label>
        <input type="number" value="${partido.orden || 0}" data-campo="orden" data-index="${index}">
      </div>

      <div class="form-group">
        <label>Visible</label>
        <select data-campo="visible" data-index="${index}">
          <option value="true" ${partido.visible === true ? "selected" : ""}>Sí</option>
          <option value="false" ${partido.visible === false ? "selected" : ""}>No</option>
        </select>
      </div>
    </div>

    <button class="btn-mini-danger btn-eliminar-partido" type="button" data-index="${index}">
      Eliminar partido
    </button>
  `;

    return div;
}

function prepararInputsPartidos() {
    const inputs = document.querySelectorAll("#partidos-admin-lista input, #partidos-admin-lista select");

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("input", actualizarPartidoDesdeInput);
        inputs[i].addEventListener("change", actualizarPartidoDesdeInput);
    }

    const botonesEliminar = document.querySelectorAll(".btn-eliminar-partido");

    for (let i = 0; i < botonesEliminar.length; i++) {
        botonesEliminar[i].addEventListener("click", function () {
            const index = Number(this.dataset.index);
            eliminarPartido(index);
        });
    }
}

function actualizarPartidoDesdeInput() {
    const index = Number(this.dataset.index);
    const campo = this.dataset.campo;
    let valor = this.value;

    if (campo === "orden") {
        valor = Number(valor);
    }

    if (campo === "visible") {
        valor = valor === "true";
    }

    partidosAdmin[index][campo] = valor;
}

function agregarPartidoTemporal() {
    let categoriaPorDefecto = "benjamin";

    if (categoriasAdmin.length > 0) {
        categoriaPorDefecto = categoriasAdmin[0].slug;
    }

    partidosAdmin.push({
        categoria: categoriaPorDefecto,
        tipo: "grupo",
        fase: "Grupo A",
        grupo: "A",
        campo: "Campo principal",
        equipoLocal: "Equipo local",
        equipoVisitante: "Equipo visitante",
        hora: "",
        resultado: "",
        orden: partidosAdmin.length + 1,
        visible: true
    });

    pintarPartidosAdmin();
}

async function eliminarPartido(index) {
    const partido = partidosAdmin[index];

    if (!confirm("¿Seguro que quieres eliminar este partido?")) {
        return;
    }

    if (!partido._id) {
        partidosAdmin.splice(index, 1);
        pintarPartidosAdmin();
        return;
    }

    const token = localStorage.getItem("tokenAdmin");

    try {
        const respuesta = await fetch("/api/partidos/" + partido._id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            partidosAdmin.splice(index, 1);
            pintarPartidosAdmin();
            mostrarMensaje("Partido eliminado correctamente.", "success");
        } else {
            mostrarMensaje(resultado.mensaje || "No se ha podido eliminar el partido.", "error");
        }

    } catch (error) {
        mostrarMensaje("Error al conectar con el servidor.", "error");
    }
}

async function guardarPartidos() {
    const token = localStorage.getItem("tokenAdmin");

    try {
        for (let i = 0; i < partidosAdmin.length; i++) {
            const partido = partidosAdmin[i];

            if (partido._id) {
                await fetch("/api/partidos/" + partido._id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(partido)
                });
            } else {
                await fetch("/api/partidos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(partido)
                });
            }
        }

        mostrarMensaje("Partidos guardados correctamente.", "success");
        await cargarPartidosAdmin();

    } catch (error) {
        mostrarMensaje("Error al guardar los partidos.", "error");
    }
}

/* PATROCINADORES */

async function cargarPatrocinadoresAdmin() {
    const token = localStorage.getItem("tokenAdmin");

    try {
        const respuesta = await fetch("/api/patrocinadores/admin/todos", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        patrocinadoresAdmin = await respuesta.json();

        pintarPatrocinadoresAdmin();

    } catch (error) {
        mostrarMensaje("No se han podido cargar los patrocinadores.", "error");
    }
}

function pintarPatrocinadoresAdmin() {
    const contenedor = document.getElementById("patrocinadores-admin-lista");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    if (patrocinadoresAdmin.length === 0) {
        contenedor.innerHTML = `
      <div class="empty-admin-box">
        No hay patrocinadores añadidos.
      </div>
    `;
        return;
    }

    for (let i = 0; i < patrocinadoresAdmin.length; i++) {
        const patrocinador = patrocinadoresAdmin[i];

        const tarjeta = document.createElement("div");
        tarjeta.className = "patrocinador-admin-card";

        tarjeta.innerHTML = `
      <div class="patrocinador-admin-title">
        <div class="patrocinador-admin-icon">
          ${patrocinador.icono || "🤝"}
        </div>

        <div>
          <strong>${patrocinador.nombre || "Nuevo patrocinador"}</strong>
          <span>${patrocinador.descripcion || "Sin descripción"}</span>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Icono</label>
          <input type="text" value="${patrocinador.icono || ""}" data-campo="icono" data-index="${i}">
        </div>

        <div class="form-group">
          <label>Nombre</label>
          <input type="text" value="${patrocinador.nombre || ""}" data-campo="nombre" data-index="${i}">
        </div>

        <div class="form-group">
          <label>Descripción</label>
          <input type="text" value="${patrocinador.descripcion || ""}" data-campo="descripcion" data-index="${i}">
        </div>

        <div class="form-group">
          <label>Orden</label>
          <input type="number" value="${patrocinador.orden || 0}" data-campo="orden" data-index="${i}">
        </div>

        <div class="form-group">
          <label>Visible</label>
          <select data-campo="visible" data-index="${i}">
            <option value="true" ${patrocinador.visible === true ? "selected" : ""}>Sí</option>
            <option value="false" ${patrocinador.visible === false ? "selected" : ""}>No</option>
          </select>
        </div>

        <div class="form-group form-group-full">
          <label>Logo</label>
          <input type="text" value="${patrocinador.logo || ""}" data-campo="logo" data-index="${i}" placeholder="imagenes/patrocinadores/logo.png">
        </div>

        <div class="form-group form-group-full">
          <label>Enlace</label>
          <input type="text" value="${patrocinador.enlace || ""}" data-campo="enlace" data-index="${i}" placeholder="https://...">
        </div>
      </div>

      <button class="btn-mini-danger btn-eliminar-patrocinador" type="button" data-index="${i}">
        Eliminar patrocinador
      </button>
    `;

        contenedor.appendChild(tarjeta);
    }

    prepararInputsPatrocinadores();
}

function prepararInputsPatrocinadores() {
    const inputs = document.querySelectorAll("#patrocinadores-admin-lista input, #patrocinadores-admin-lista select");

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("input", actualizarPatrocinadorDesdeInput);
        inputs[i].addEventListener("change", actualizarPatrocinadorDesdeInput);
    }

    const botonesEliminar = document.querySelectorAll(".btn-eliminar-patrocinador");

    for (let i = 0; i < botonesEliminar.length; i++) {
        botonesEliminar[i].addEventListener("click", function () {
            const index = Number(this.dataset.index);
            eliminarPatrocinador(index);
        });
    }
}

function actualizarPatrocinadorDesdeInput() {
    const index = Number(this.dataset.index);
    const campo = this.dataset.campo;
    let valor = this.value;

    if (campo === "orden") {
        valor = Number(valor);
    }

    if (campo === "visible") {
        valor = valor === "true";
    }

    patrocinadoresAdmin[index][campo] = valor;
}

function agregarPatrocinadorTemporal() {
    patrocinadoresAdmin.push({
        nombre: "Nuevo patrocinador",
        descripcion: "Colaborador",
        logo: "",
        icono: "🤝",
        enlace: "",
        orden: patrocinadoresAdmin.length + 1,
        visible: true
    });

    pintarPatrocinadoresAdmin();
}

async function eliminarPatrocinador(index) {
    const patrocinador = patrocinadoresAdmin[index];

    if (!confirm("¿Seguro que quieres eliminar este patrocinador?")) {
        return;
    }

    if (!patrocinador._id) {
        patrocinadoresAdmin.splice(index, 1);
        pintarPatrocinadoresAdmin();
        return;
    }

    const token = localStorage.getItem("tokenAdmin");

    try {
        const respuesta = await fetch("/api/patrocinadores/" + patrocinador._id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            patrocinadoresAdmin.splice(index, 1);
            pintarPatrocinadoresAdmin();
            mostrarMensaje("Patrocinador eliminado correctamente.", "success");
        } else {
            mostrarMensaje(resultado.mensaje || "No se ha podido eliminar el patrocinador.", "error");
        }

    } catch (error) {
        mostrarMensaje("Error al conectar con el servidor.", "error");
    }
}

async function guardarPatrocinadores() {
    const token = localStorage.getItem("tokenAdmin");

    try {
        for (let i = 0; i < patrocinadoresAdmin.length; i++) {
            const patrocinador = patrocinadoresAdmin[i];

            if (patrocinador._id) {
                await fetch("/api/patrocinadores/" + patrocinador._id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(patrocinador)
                });
            } else {
                await fetch("/api/patrocinadores", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(patrocinador)
                });
            }
        }

        mostrarMensaje("Patrocinadores guardados correctamente.", "success");
        await cargarPatrocinadoresAdmin();

    } catch (error) {
        mostrarMensaje("Error al guardar los patrocinadores.", "error");
    }
}

/* SORTEOS */

async function cargarSorteosAdmin() {
    const token = localStorage.getItem("tokenAdmin");

    try {
        const respuesta = await fetch("/api/sorteos/admin/todos", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        sorteosAdmin = await respuesta.json();

        pintarSorteosAdmin();

    } catch (error) {
        mostrarMensaje("No se han podido cargar los sorteos.", "error");
    }
}

function pintarSorteosAdmin() {
    const contenedor = document.getElementById("sorteos-admin-lista");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    if (sorteosAdmin.length === 0) {
        contenedor.innerHTML = `
      <div class="empty-admin-box">
        No hay sorteos añadidos.
      </div>
    `;
        return;
    }

    for (let i = 0; i < sorteosAdmin.length; i++) {
        const sorteo = sorteosAdmin[i];

        const tarjeta = document.createElement("div");
        tarjeta.className = "sorteo-admin-card";

        tarjeta.innerHTML = `
      <div class="sorteo-admin-title">
        <div class="sorteo-admin-icon">
          ${sorteo.icono || "🎁"}
        </div>

        <div>
          <strong>${sorteo.titulo || "Nuevo sorteo"}</strong>
          <span>${sorteo.descripcion || "Sin descripción"}</span>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Icono</label>
          <input type="text" value="${sorteo.icono || ""}" data-campo="icono" data-index="${i}">
        </div>

        <div class="form-group">
          <label>Título</label>
          <input type="text" value="${sorteo.titulo || ""}" data-campo="titulo" data-index="${i}">
        </div>

        <div class="form-group">
          <label>Orden</label>
          <input type="number" value="${sorteo.orden || 0}" data-campo="orden" data-index="${i}">
        </div>

        <div class="form-group">
          <label>Visible</label>
          <select data-campo="visible" data-index="${i}">
            <option value="true" ${sorteo.visible === true ? "selected" : ""}>Sí</option>
            <option value="false" ${sorteo.visible === false ? "selected" : ""}>No</option>
          </select>
        </div>

        <div class="form-group form-group-full">
          <label>Descripción</label>
          <input type="text" value="${sorteo.descripcion || ""}" data-campo="descripcion" data-index="${i}">
        </div>

        <div class="form-group form-group-full">
          <label>Imagen</label>
          <input type="text" value="${sorteo.imagen || ""}" data-campo="imagen" data-index="${i}" placeholder="imagenes/general/sorteo.png">
        </div>
      </div>

      <button class="btn-mini-danger btn-eliminar-sorteo" type="button" data-index="${i}">
        Eliminar sorteo
      </button>
    `;

        contenedor.appendChild(tarjeta);
    }

    prepararInputsSorteos();
}

function prepararInputsSorteos() {
    const inputs = document.querySelectorAll("#sorteos-admin-lista input, #sorteos-admin-lista select");

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("input", actualizarSorteoDesdeInput);
        inputs[i].addEventListener("change", actualizarSorteoDesdeInput);
    }

    const botonesEliminar = document.querySelectorAll(".btn-eliminar-sorteo");

    for (let i = 0; i < botonesEliminar.length; i++) {
        botonesEliminar[i].addEventListener("click", function () {
            const index = Number(this.dataset.index);
            eliminarSorteo(index);
        });
    }
}

function actualizarSorteoDesdeInput() {
    const index = Number(this.dataset.index);
    const campo = this.dataset.campo;
    let valor = this.value;

    if (campo === "orden") {
        valor = Number(valor);
    }

    if (campo === "visible") {
        valor = valor === "true";
    }

    sorteosAdmin[index][campo] = valor;
}

function agregarSorteoTemporal() {
    sorteosAdmin.push({
        titulo: "Nuevo sorteo",
        descripcion: "Descripción del sorteo",
        icono: "🎁",
        imagen: "",
        orden: sorteosAdmin.length + 1,
        visible: true
    });

    pintarSorteosAdmin();
}

async function eliminarSorteo(index) {
    const sorteo = sorteosAdmin[index];

    if (!confirm("¿Seguro que quieres eliminar este sorteo?")) {
        return;
    }

    if (!sorteo._id) {
        sorteosAdmin.splice(index, 1);
        pintarSorteosAdmin();
        return;
    }

    const token = localStorage.getItem("tokenAdmin");

    try {
        const respuesta = await fetch("/api/sorteos/" + sorteo._id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            sorteosAdmin.splice(index, 1);
            pintarSorteosAdmin();
            mostrarMensaje("Sorteo eliminado correctamente.", "success");
        } else {
            mostrarMensaje(resultado.mensaje || "No se ha podido eliminar el sorteo.", "error");
        }

    } catch (error) {
        mostrarMensaje("Error al conectar con el servidor.", "error");
    }
}

async function guardarSorteos() {
    const token = localStorage.getItem("tokenAdmin");

    const sorteosLimpios = [];

    for (let i = 0; i < sorteosAdmin.length; i++) {
        const sorteo = sorteosAdmin[i];

        if (sorteo.titulo && sorteo.titulo.trim() !== "") {
            sorteosLimpios.push({
                titulo: sorteo.titulo,
                descripcion: sorteo.descripcion || "",
                icono: sorteo.icono || "🎁",
                imagen: sorteo.imagen || "",
                orden: Number(sorteo.orden) || i + 1,
                visible: sorteo.visible !== false
            });
        }
    }

    try {
        const respuesta = await fetch("/api/sorteos/admin/reemplazar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                sorteos: sorteosLimpios
            })
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            mostrarMensaje("Sorteos guardados correctamente.", "success");
            await cargarSorteosAdmin();
        } else {
            mostrarMensaje(resultado.mensaje || "No se han podido guardar los sorteos.", "error");
        }

    } catch (error) {
        mostrarMensaje("Error al conectar con el servidor.", "error");
    }
}

/* MENSAJES */

function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById("save-success");

    mensaje.textContent = texto;
    mensaje.className = "admin-message " + tipo;

    setTimeout(function () {
        mensaje.style.display = "none";
        mensaje.className = "save-success";
    }, 3000);
}