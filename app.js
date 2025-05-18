const URL_API = "http://localhost:3000/todos";
const txtNombre = document.getElementById("txtNombre");
const txtDescripcion = document.getElementById("txtDescripcion");
const tablaTareas = document.getElementById("tablaTareas");

LlenarTabla();

async function LlenarTabla() {
  const tareas = await ObtenerTareas();
  DibujarTabla(tareas);
}

async function ObtenerTareas() {
  const response = await fetch(URL_API);

  if (!response.ok) {
    alert("Error al obtener datos del servidor");
    return null;
  }

  const tareas = await response.json();
  return tareas;
}

async function Guardar() {
  const nuevaTarea = {
    name: txtNombre.value,
    description: txtDescripcion.value.trim(),
  };

  const response = await fetch(URL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevaTarea),
  });

  if (!response.ok) {
    alert("Error llamando al servicio");
    return;
  }

  const tareaGuardada = await response.json();
  alert("Tarea guardada con éxito. Nuevo id: " + tareaGuardada.id);
}

function DibujarTabla(tareas) {
  tareas.forEach((tarea) => {
    const nuevaFila = tablaTareas.insertRow();
    LlenarFila(nuevaFila, tarea);
  });
}

function LlenarFila(fila, tarea) {
  const celdaNombre = fila.insertCell();
  celdaNombre.textContent = tarea.name;

  const celdaDescripcion = fila.insertCell();
  celdaDescripcion.textContent = tarea.description;

  const celdaCompleto = fila.insertCell();
  celdaCompleto.textContent = tarea.complete === "1" ? "YES" : "NO";

  const celdaFecha = fila.insertCell();
  const fecha = new Date(tarea.created_at);
  celdaFecha.textContent = fecha.toLocaleDateString();

  const celdaAcciones = fila.insertCell();
  const btnEditar = "<button class='btnEditar btn btn-warning'>Editar</button>";
  const btnEliminar = 
  `<button class="btnEliminar btn btn-danger" 
  onclick="EliminarTarea('${tarea.name}', ${tarea.id});">
  Eliminar</button>`;  
  celdaAcciones.innerHTML += btnEditar;
  celdaAcciones.innerHTML += btnEliminar;
}

function EliminarTarea(tareaName, id) {
  const mensaje = "Confirma la eliminación de: " + tareaName;
  const respuestaUsuario = confirm(mensaje);

  if (!respuestaUsuario)
    return;

  // Lógica para llamar al API y eliminar
  alert("Se eliminó la tarea: " + tareaName);
}
