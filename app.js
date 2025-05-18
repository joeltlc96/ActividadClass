const apiUrl = 'http://localhost:3000/todos'; // Cambia esta URL según tu backend
const todoForm = document.getElementById('todoForm');
const todoTableBody = document.getElementById('todoTableBody');

let editingId = null;

// Obtener todos
async function fetchTodos() {
  const response = await fetch(apiUrl);
  const todos = await response.json();
  renderTodos(todos);
}

// Crear o actualizar tarea
todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;

  const todoData = {
    nombre,
    descripcion,
    estaCompleto: false,
    fechaCreacion: new Date().toISOString()
  };

  if (editingId) {
    await fetch(`${apiUrl}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
    editingId = null;
  } else {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
  }

  todoForm.reset();
  fetchTodos();
});

// Renderizar tabla
function renderTodos(todos) {
  todoTableBody.innerHTML = '';
  todos.forEach(todo => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${todo.id}</td>
      <td>${todo.nombre}</td>
      <td>${todo.descripcion}</td>
      <td>
        <input type="checkbox" ${todo.estaCompleto ? 'checked' : ''} onchange="toggleCompleto(${todo.id}, this.checked)">
      </td>
      <td>${new Date(todo.fechaCreacion).toLocaleString()}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editTodo(${todo.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTodo(${todo.id})">Eliminar</button>
      </td>
    `;
    todoTableBody.appendChild(row);
  });
}

// Editar tarea
async function editTodo(id) {
  const res = await fetch(`${apiUrl}/${id}`);
  const todo = await res.json();
  document.getElementById('nombre').value = todo.nombre;
  document.getElementById('descripcion').value = todo.descripcion;
  editingId = id;
}

// Eliminar tarea
async function deleteTodo(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  fetchTodos();
}

// Marcar como completado
async function toggleCompleto(id, checked) {
  const res = await fetch(`${apiUrl}/${id}`);
  const todo = await res.json();
  todo.estaCompleto = checked;
  await fetch(`${apiUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  });
  fetchTodos();
}

// Inicializar
fetchTodos();
