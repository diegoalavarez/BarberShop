// --- CRUD de citas robusto y clásico ---
let citaActual = null;
let modoEdicion = false;

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("corte").value = "";
  document.getElementById("hora").value = "";
  modoEdicion = false;
  document.getElementById("botonAgendar").textContent = "✍️ Agendar";
}

function mostrarFormulario() {
  limpiarFormulario();
  document.getElementById("formCita").classList.remove("hidden");
  document.getElementById("mensajeCita").classList.add("hidden");
}

function mostrarMensaje(mensaje, exito) {
  const div = document.getElementById("mensajeCita");
  div.innerHTML = mensaje;
  div.style.color = exito ? "green" : "red";
  div.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  llenarHorario();
  cargarCitaUsuario();
  document.getElementById("botonAgendar").addEventListener("click", agendar);
});

async function cargarCitaUsuario() {
  try {
    const res = await fetch("/api/appointments", { credentials: "include" });
    const data = await res.json();
    const cita = data.appointments && data.appointments.find(c => c.estado === "pendiente");
    if (cita) {
      citaActual = cita;
      mostrarOverlayCRUD(citaActual);
      document.getElementById("formCita").classList.add("hidden");
    } else {
      citaActual = null;
      mostrarFormulario();
    }
  } catch (e) {
    mostrarMensaje("Error al cargar las citas", false);
  }
}

async function llenarHorario() {
  const horaSelect = document.getElementById("hora");
  horaSelect.innerHTML = "";
  const res = await fetch("/api/appointments/available-hours", { credentials: "include" });
  if (!res.ok) return mostrarMensaje("No autorizado para ver las horas", false);
  const data = await res.json();
  const optVacio = document.createElement("option");
  optVacio.value = "";
  optVacio.textContent = "Selecciona hora";
  horaSelect.appendChild(optVacio);
  (data.horas || []).forEach(hora => {
    const opt = document.createElement("option");
    opt.value = hora;
    opt.textContent = hora;
    horaSelect.appendChild(opt);
  });
}

async function agendar() {
  const nombre = document.getElementById("nombre").value.trim();
  const corte = document.getElementById("corte").value;
  const hora = document.getElementById("hora").value;
  if (!nombre || !corte || !hora) return mostrarMensaje("Completa todos los campos", false);
  if (modoEdicion && citaActual && (citaActual._id || citaActual.id)) {
    const id = citaActual._id || citaActual.id;
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, corte, hora }),
      credentials: "include"
    });
    const data = await res.json();
    if (data.appointment) {
      modoEdicion = false;
      cargarCitaUsuario();
      mostrarMensaje("Cita editada", true);
    } else {
      mostrarMensaje("Error al editar", false);
    }
  } else {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, corte, hora }),
      credentials: "include"
    });
    const data = await res.json();
    if (data.appointment) {
      citaActual = data.appointment;
      mostrarOverlayCRUD(citaActual);
      mostrarMensaje("Cita agendada", true);
      document.getElementById("formCita").classList.add("hidden");
    } else {
      mostrarMensaje(data.error || "Error al agendar", false);
    }
  }
}

function mostrarOverlayCRUD(cita) {
  const overlay = document.getElementById("overlayConfirmacion");
  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
  document.querySelector("#overlayConfirmacion h2").textContent = `✅ Cita agendada`;
  document.getElementById("infoConfirmacion").innerHTML = `
    <p><strong>Usuario:</strong> ${cita.nombre}</p>
    <p><strong>Estilo de corte:</strong> ${cita.corte}</p>
    <p><strong>Hora seleccionada:</strong> ${cita.hora}</p>
  `;
  document.getElementById("btnConfirmar").onclick = confirmarCita;
  document.getElementById("btnEditar").onclick = editarCita;
  document.getElementById("btnEliminar").onclick = eliminarCita;
}

function editarCita() {
  if (!citaActual) return;
  modoEdicion = true;
  document.getElementById("formCita").classList.remove("hidden");
  document.getElementById("mensajeCita").classList.add("hidden");
  document.getElementById("nombre").value = citaActual.nombre;
  document.getElementById("corte").value = citaActual.corte;
  document.getElementById("hora").value = citaActual.hora;
  document.getElementById("botonAgendar").textContent = "💾 Guardar cambios";
  cerrarOverlay();
}

async function eliminarCita() {
  if (!citaActual || !(citaActual._id || citaActual.id)) return;
  const id = citaActual._id || citaActual.id;
  try {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    const data = await res.json();
    mostrarMensaje("Cita eliminada", true);
    citaActual = null;
    cargarCitaUsuario();
    mostrarFormulario();
    cerrarOverlay();
  } catch (e) {
    mostrarMensaje("Error al eliminar", false);
  }
}

async function confirmarCita() {
  if (!citaActual || !(citaActual._id || citaActual.id)) return;
  const id = citaActual._id || citaActual.id;
  try {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "confirmada" }),
      credentials: "include"
    });
    const data = await res.json();
    mostrarMensaje("Cita confirmada", true);
    cargarCitaUsuario();
    mostrarFormulario();
    cerrarOverlay();
  } catch (e) {
    mostrarMensaje("Error al confirmar", false);
  }
}

function cerrarOverlay() {
  const overlay = document.getElementById("overlayConfirmacion");
  overlay.classList.remove("flex");
  overlay.classList.add("hidden");
}
// --- Fin CRUD robusto ---