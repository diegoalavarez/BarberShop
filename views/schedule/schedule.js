document.addEventListener("DOMContentLoaded", () => {
  llenarHorario();

  // Restaura la cita si existe en localStorage
  const citaGuardada = localStorage.getItem('citaActual');
  if (citaGuardada) {
    citaActual = JSON.parse(citaGuardada);
    mostrarMensajeCitaCRUD(citaActual, "Cita agendada correctamente.");
    document.getElementById("formCita").classList.add("hidden");
    document.getElementById("mensajeCita").classList.remove("hidden");
  }

  const boton = document.getElementById("botonAgendar");
  if (boton) boton.addEventListener("click", agendar);
});

async function llenarHorario() {
  const horaSelect = document.getElementById("hora");
  horaSelect.innerHTML = "";

  const res = await fetch('/api/appointments/horas-disponibles');
  const data = await res.json();

  // Opción vacía
  const optVacio = document.createElement("option");
  optVacio.value = "";
  optVacio.textContent = "Selecciona hora";
  horaSelect.appendChild(optVacio);

  data.horas.forEach(hora => {
    const opt = document.createElement("option");
    opt.value = hora;
    opt.textContent = hora;
    horaSelect.appendChild(opt);
  });
}

let citaActual = null;
let modoEdicion = false;

async function agendar() {
  const nombre = document.getElementById("nombre").value.trim();
  const corte = document.getElementById("corte").value;
  const hora = document.getElementById("hora").value;

  if (!nombre || !corte || !hora) {
    mostrarMensaje("Por favor completa todos los campos.", false);
    return;
  }

  if (modoEdicion && citaActual && citaActual._id) {
    // Actualizar cita (PUT)
    const res = await fetch(`/api/appointments/${citaActual._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, corte, hora })
    });
    const data = await res.json();
    if (data.appointment) {
      citaActual = data.appointment;
      mostrarMensajeCitaCRUD(citaActual, "Cita actualizada correctamente.");
      document.getElementById("formCita").classList.add("hidden");
      document.getElementById("mensajeCita").classList.remove("hidden");
      modoEdicion = false;
      limpiarFormulario();
    } else {
      mostrarMensaje("Error al actualizar la cita.", false);
    }
  } else {
    // Crear cita (POST)
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, corte, hora })
    });
    const data = await res.json();

    if (data.appointment) {
      citaActual = data.appointment;
      localStorage.setItem('citaActual', JSON.stringify(citaActual)); // <-- Pega aquí
      mostrarMensajeCitaCRUD(citaActual, "Cita agendada correctamente.");
      document.getElementById("formCita").classList.add("hidden");
      document.getElementById("mensajeCita").classList.remove("hidden");
    } else if (data.error) {
      mostrarMensaje(data.error, false);
    }
  }
}

function mostrarMensajeCitaCRUD(cita, mensaje) {
  mostrarMensaje(`
    <div class="p-4 bg-green-100 rounded shadow mt-4">
      <h3 class="text-xl font-bold mb-2">✅ ${mensaje}</h3>
      <p><strong>Usuario:</strong> ${cita.nombre}</p>
      <p><strong>Estilo de corte:</strong> ${cita.corte}</p>
      <p><strong>Hora seleccionada:</strong> ${cita.hora}</p>
      <div class="mt-4 flex gap-2 justify-center">
        <button id="btnConfirmar" class="bg-green-600 text-white px-4 py-2 rounded">Confirmar cita</button>
        <button id="btnEditar" class="bg-yellow-500 text-white px-4 py-2 rounded">Editar cita</button>
        <button id="btnEliminar" class="bg-red-500 text-white px-4 py-2 rounded">Eliminar cita</button>
      </div>
    </div>
  `, true);

  document.getElementById("btnConfirmar").onclick = confirmarCita;
  document.getElementById("btnEditar").onclick = editarCita;
  document.getElementById("btnEliminar").onclick = eliminarCita;
}

function mostrarMensaje(html, esExito) {
  const mensajeDiv = document.getElementById("mensajeCita");
  mensajeDiv.innerHTML = html;
  mensajeDiv.style.color = esExito ? "green" : "red";
}

function confirmarCita() {
  mostrarMensaje('<div class="p-4 bg-blue-100 rounded shadow mt-4 text-center">✅ Cita confirmada y guardada.</div>', true);
  citaActual = null;
  localStorage.removeItem('citaActual');
  setTimeout(() => {
    document.getElementById("formCita").classList.remove("hidden");
    mostrarMensaje("", true);
    limpiarFormulario();
  }, 1500);
}

function editarCita() {
  if (!citaActual) return;
  document.getElementById("nombre").value = citaActual.nombre;
  document.getElementById("corte").value = citaActual.corte;
  document.getElementById("hora").value = citaActual.hora;
  document.getElementById("formCita").classList.remove("hidden");
  document.getElementById("mensajeCita").classList.add("hidden");
  modoEdicion = true;
}

async function eliminarCita() {
  if (!citaActual || !citaActual._id) return;
  await fetch(`/api/appointments/${citaActual._id}`, { method: 'DELETE' });
  mostrarMensaje('<div class="p-4 bg-red-100 rounded shadow mt-4 text-center">Cita eliminada.</div>', false);
  citaActual = null;
  localStorage.removeItem('citaActual');
  setTimeout(() => {
    document.getElementById("formCita").classList.remove("hidden");
    document.getElementById("mensajeCita").classList.add("hidden");
    limpiarFormulario();
  }, 1500);
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("corte").value = "";
  document.getElementById("hora").value = "";
  modoEdicion = false;
}