document.addEventListener("DOMContentLoaded", () => {
  llenarHorario();
  listarCitas(); // Carga la lista de citas al inicio

  const boton = document.getElementById("botonAgendar");
  if (boton) boton.addEventListener("click", agendar);
});

function llenarHorario() {
  const horaSelect = document.getElementById("hora");
  horaSelect.innerHTML = ""; // Limpia opciones previas

  // Opción vacía
  const optVacio = document.createElement("option");
  optVacio.value = "";
  optVacio.textContent = "Selecciona hora";
  horaSelect.appendChild(optVacio);

  // Array de horas exactas
  const horas = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"
  ];

  horas.forEach(hora => {
    const opt = document.createElement("option");
    opt.value = hora;
    opt.textContent = hora;
    horaSelect.appendChild(opt);
  });
}

let citaActualId = null;

async function agendar() {
  const nombre = document.getElementById("nombre").value.trim();
  const corte = document.getElementById("corte").value;
  const hora = document.getElementById("hora").value;

  if (!nombre || !corte || !hora) {
    mostrarMensaje("Por favor completa todos los campos.", false);
    return;
  }

  const res = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, corte, hora })
  });
  const data = await res.json();

  if (data.appointment) {
    citaActualId = data.appointment._id; // Guarda el id de la cita creada
    mostrarMensaje(`
      <div class="p-4 bg-green-100 rounded shadow mt-4">
        <h3 class="text-xl font-bold mb-2">✅ Cita Confirmada</h3>
        <p><strong>Usuario:</strong> ${data.appointment.nombre}</p>
        <p><strong>Estilo de corte:</strong> ${data.appointment.corte}</p>
        <p><strong>Hora seleccionada:</strong> ${data.appointment.hora}</p>
        <div class="mt-4 flex gap-2">
          <button id="btnEditar" class="bg-yellow-500 text-white px-4 py-2 rounded">Editar</button>
          <button id="btnEliminar" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar</button>
          <button id="btnListar" class="bg-blue-500 text-white px-4 py-2 rounded">Listar</button>
        </div>
      </div>
    `, true);

    document.getElementById("btnEditar").onclick = () => editarCita(data.appointment);
    document.getElementById("btnEliminar").onclick = () => eliminarCita(data.appointment._id);
    document.getElementById("btnListar").onclick = listarCitas;
  } else if (data.error) {
    mostrarMensaje(data.error, false);
  }
}

function mostrarMensaje(html, esExito) {
  const mensajeDiv = document.getElementById("mensajeCita");
  mensajeDiv.innerHTML = html;
  mensajeDiv.style.color = esExito ? "green" : "red";
}

async function listarCitas() {
  const res = await fetch('/api/appointments');
  const data = await res.json();
  const listaDiv = document.getElementById("listaCitas");
  listaDiv.innerHTML = data.appointments.map(cita => `
    <div class="border p-2 my-2 rounded">
      <strong>${cita.nombre}</strong> - ${cita.corte} - ${cita.hora}
      <button onclick="editarCitaDesdeLista('${cita._id}')" class="ml-2 bg-yellow-500 text-white px-2 py-1 rounded">Editar</button>
      <button onclick="eliminarCita('${cita._id}')" class="ml-2 bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
    </div>
  `).join('');
}

function editarCita(cita) {
  document.getElementById("nombre").value = cita.nombre;
  document.getElementById("corte").value = cita.corte;
  document.getElementById("hora").value = cita.hora;
  citaActualId = cita._id;
  document.getElementById("botonAgendar").textContent = "Actualizar";
  document.getElementById("botonAgendar").onclick = actualizarCita;
}

async function editarCitaDesdeLista(id) {
  const res = await fetch(`/api/appointments`);
  const data = await res.json();
  const cita = data.appointments.find(c => c._id === id);
  if (cita) editarCita(cita);
}

async function actualizarCita() {
  const nombre = document.getElementById("nombre").value.trim();
  const corte = document.getElementById("corte").value;
  const hora = document.getElementById("hora").value;

  const res = await fetch(`/api/appointments/${citaActualId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, corte, hora })
  });
  const data = await res.json();
  mostrarMensaje("Cita actualizada correctamente.", true);
  document.getElementById("botonAgendar").textContent = "Agendar";
  document.getElementById("botonAgendar").onclick = agendar;
  listarCitas();
}

async function eliminarCita(id) {
  await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
  mostrarMensaje("Cita eliminada.", true);
  listarCitas();
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("corte").value = "";
  document.getElementById("hora").value = "";
  document.getElementById("mensajeCita").innerHTML = "";
}

function cancelarCita() {
  limpiarFormulario();
}

function completarCita() {
  limpiarFormulario();
}