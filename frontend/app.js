const API_URL = "http://localhost:8080";

let videojuegos = [];
let categorias = [];
let editandoId = null;

const form = document.getElementById("game-form");
const formTitle = document.getElementById("form-title");
const message = document.getElementById("message");
const gamesList = document.getElementById("games-list");
const gameDetail = document.getElementById("game-detail");

const tituloInput = document.getElementById("titulo");
const plataformaInput = document.getElementById("plataforma");
const anioInput = document.getElementById("anio");
const categoriaSelect = document.getElementById("categoriaId");

const searchInput = document.getElementById("search-input");
const filterCategory = document.getElementById("filter-category");
const reloadBtn = document.getElementById("reload-btn");
const cancelBtn = document.getElementById("cancel-btn");

document.addEventListener("DOMContentLoaded", async () => {
  await inicializar();
});

async function inicializar() {
  await cargarCategorias();
  await cargarVideojuegos();
  configurarEventos();
}

function configurarEventos() {
  form.addEventListener("submit", guardarVideojuego);
  cancelBtn.addEventListener("click", cancelarEdicion);
  reloadBtn.addEventListener("click", async () => {
    await cargarCategorias();
    await cargarVideojuegos();
    mostrarMensaje("Datos recargados correctamente.", "success");
  });
  searchInput.addEventListener("input", renderizarVideojuegos);
  filterCategory.addEventListener("change", renderizarVideojuegos);
}

async function cargarCategorias() {
  try {
    const response = await fetch(`${API_URL}/categorias`);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    categorias = await response.json();

    categoriaSelect.innerHTML = `<option value="">Selecciona una categoría</option>`;
    filterCategory.innerHTML = `<option value="">Todas las categorías</option>`;

    categorias.forEach((categoria) => {
      const optionForm = document.createElement("option");
      optionForm.value = categoria.id;
      optionForm.textContent = categoria.nombre;
      categoriaSelect.appendChild(optionForm);

      const optionFilter = document.createElement("option");
      optionFilter.value = categoria.id;
      optionFilter.textContent = categoria.nombre;
      filterCategory.appendChild(optionFilter);
    });
  } catch (error) {
    console.error("Error cargando categorías:", error);
    categoriaSelect.innerHTML = `<option value="">No se pudieron cargar</option>`;
    filterCategory.innerHTML = `<option value="">No disponible</option>`;
    mostrarMensaje("No se pudieron cargar las categorías.", "error");
  }
}

async function cargarVideojuegos() {
  try {
    const response = await fetch(`${API_URL}/videojuegos`);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    videojuegos = await response.json();
    renderizarVideojuegos();
  } catch (error) {
    console.error("Error cargando videojuegos:", error);
    gamesList.innerHTML = `<p>No se pudieron cargar los videojuegos.</p>`;
    mostrarMensaje("No se pudieron cargar los videojuegos.", "error");
  }
}

function obtenerVideojuegosFiltrados() {
  const texto = searchInput.value.trim().toLowerCase();
  const categoriaId = filterCategory.value;

  return videojuegos.filter((juego) => {
    const coincideTexto =
      juego.titulo.toLowerCase().includes(texto) ||
      juego.plataforma.toLowerCase().includes(texto);

    const coincideCategoria =
      !categoriaId || String(juego.categoria?.id) === String(categoriaId);

    return coincideTexto && coincideCategoria;
  });
}

function renderizarVideojuegos() {
  const listaFiltrada = obtenerVideojuegosFiltrados();

  gamesList.innerHTML = "";

  if (listaFiltrada.length === 0) {
    gamesList.innerHTML = `<p>No hay videojuegos para mostrar.</p>`;
    return;
  }

  listaFiltrada.forEach((juego) => {
    const card = document.createElement("div");
    card.className = "game-card";

    card.innerHTML = `
      <h3>${juego.titulo}</h3>
      <p><strong>Plataforma:</strong> ${juego.plataforma}</p>
      <p><strong>Año:</strong> ${juego.anio}</p>
      <p><strong>Categoría:</strong> ${juego.categoria?.nombre ?? "Sin categoría"}</p>

      <div class="actions">
        <button class="view-btn" data-id="${juego.id}">Ver</button>
        <button class="edit-btn" data-id="${juego.id}">Editar</button>
        <button class="delete-btn" data-id="${juego.id}">Eliminar</button>
      </div>
    `;

    const [viewBtn, editBtn, deleteBtn] = card.querySelectorAll("button");

    viewBtn.addEventListener("click", () => verDetalle(juego.id));
    editBtn.addEventListener("click", () => cargarEdicion(juego.id));
    deleteBtn.addEventListener("click", () => eliminarVideojuego(juego.id));

    gamesList.appendChild(card);
  });
}

function verDetalle(id) {
  const juego = videojuegos.find((item) => item.id === id);

  if (!juego) {
    gameDetail.innerHTML = "No se encontró la información del videojuego.";
    return;
  }

  gameDetail.innerHTML = `
    <strong>ID:</strong> ${juego.id}<br>
    <strong>Título:</strong> ${juego.titulo}<br>
    <strong>Plataforma:</strong> ${juego.plataforma}<br>
    <strong>Año:</strong> ${juego.anio}<br>
    <strong>Categoría:</strong> ${juego.categoria?.nombre ?? "Sin categoría"}
  `;
}

async function guardarVideojuego(event) {
  event.preventDefault();

  const titulo = tituloInput.value.trim();
  const plataforma = plataformaInput.value.trim();
  const anio = anioInput.value.trim();
  const categoriaId = categoriaSelect.value;

  if (!titulo || !plataforma || !anio || !categoriaId) {
    mostrarMensaje("Debes completar todos los campos.", "error");
    return;
  }

  const payload = {
    titulo: titulo,
    plataforma: plataforma,
    anio: Number(anio),
    categoria: {
      id: Number(categoriaId)
    }
  };

  try {
    let response;

    if (editandoId === null) {
      response = await fetch(`${API_URL}/videojuegos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    } else {
      response = await fetch(`${API_URL}/videojuegos/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error HTTP ${response.status}`);
    }

    mostrarMensaje(
      editandoId === null
        ? "Videojuego creado correctamente."
        : "Videojuego actualizado correctamente.",
      "success"
    );

    cancelarEdicion(false);
    await cargarVideojuegos();
  } catch (error) {
    console.error("Error guardando videojuego:", error);
    mostrarMensaje("No se pudo guardar el videojuego.", "error");
  }
}

function cargarEdicion(id) {
  const juego = videojuegos.find((item) => item.id === id);

  if (!juego) {
    mostrarMensaje("No se encontró el videojuego a editar.", "error");
    return;
  }

  editandoId = id;

  tituloInput.value = juego.titulo;
  plataformaInput.value = juego.plataforma;
  anioInput.value = juego.anio;
  categoriaSelect.value = juego.categoria?.id ?? "";

  formTitle.textContent = "Editar videojuego";
  mostrarMensaje("Modo edición activado.", "success");
}

function cancelarEdicion(limpiarMensaje = true) {
  editandoId = null;
  form.reset();
  formTitle.textContent = "Agregar videojuego";

  if (limpiarMensaje) {
    mostrarMensaje("", "");
  }
}

async function eliminarVideojuego(id) {
  const confirmado = confirm("¿Seguro que deseas eliminar este videojuego?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/videojuegos/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    mostrarMensaje("Videojuego eliminado correctamente.", "success");

    if (editandoId === id) {
      cancelarEdicion(false);
    }

    gameDetail.innerHTML = "Selecciona un videojuego para ver su información.";
    await cargarVideojuegos();
  } catch (error) {
    console.error("Error eliminando videojuego:", error);
    mostrarMensaje("No se pudo eliminar el videojuego.", "error");
  }
}

function mostrarMensaje(texto, tipo) {
  message.textContent = texto;
  message.className = tipo || "";
}