// ...existing code...

// Limpia los campos del formulario de cita
function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("corte").value = "";
  document.getElementById("hora").value = "";
  modoEdicion = false;
}

// Muestra un mensaje de error o éxito en el div correspondiente
function mostrarMensaje(mensaje, esExito) {
  const mensajeDiv = document.getElementById("mensajeCita");
  mensajeDiv.innerHTML = mensaje;
  mensajeDiv.style.color = esExito ? "green" : "red";
}
document.addEventListener("DOMContentLoaded", () => {
  llenarHorario();
  cargarCitasUsuario();

  const boton = document.getElementById("botonAgendar");
  if (boton) boton.addEventListener("click", agendar);
});

async function cargarCitasUsuario() {
  try {
    const res = await fetch('/api/appointments', { credentials: 'include' });
    const data = await res.json();
    if (data.appointments && data.appointments.length > 0) {
      // Busca la última cita no eliminada (pendiente o confirmada)
      const citaMostrada = data.appointments.filter(c => c.estado !== 'eliminada').pop();
      if (citaMostrada) {
        citaActual = citaMostrada;
        let mensaje = citaActual.estado === 'pendiente' ? "Cita agendada correctamente." : "Cita confirmada";
        // Asegura que el overlay esté visible y no tenga la clase 'hidden'
        const overlay = document.getElementById('overlayConfirmacion');
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        mostrarOverlayCRUD(citaActual, mensaje);
        document.getElementById("formCita").classList.add("hidden");
        document.getElementById("mensajeCita").classList.remove("hidden");
      } else {
        document.getElementById("formCita").classList.remove("hidden");
        document.getElementById("mensajeCita").classList.add("hidden");
      }
    } else {
      // No hay citas, muestra el formulario
      document.getElementById("formCita").classList.remove("hidden");
      document.getElementById("mensajeCita").classList.add("hidden");
    }
  } catch (error) {
    mostrarMensaje("Error al cargar las citas.", false);
  }
}

async function llenarHorario() {
  const horaSelect = document.getElementById("hora");
  horaSelect.innerHTML = "";

  const res = await fetch('/api/appointments/available-hours', { credentials: 'include' });

  if (!res.ok) {
    mostrarMensaje("No autorizado para ver las horas disponibles.", false);
    return;
  }

  const data = await res.json();

  // Opción vacía
  const optVacio = document.createElement("option");
  optVacio.value = "";
  optVacio.textContent = "Selecciona hora";
  horaSelect.appendChild(optVacio);

  if (data.horas && Array.isArray(data.horas)) {
    data.horas.forEach(hora => {
      const opt = document.createElement("option");
      opt.value = hora;
      opt.textContent = hora;
      horaSelect.appendChild(opt);
    });
  }
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
      body: JSON.stringify({ nombre, corte, hora }),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.appointment) {
      cargarCitasUsuario();
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
      body: JSON.stringify({ nombre, corte, hora }),
      credentials: 'include' // si usas cookies
    });
    const data = await res.json();

    if (data.appointment) {
      // Mostrar el overlay CRUD para la cita recién agendada
      citaActual = data.appointment;
      mostrarOverlayCRUD(citaActual, "¡Cita agendada!");
      limpiarFormulario();
      // No refrescar la lista de citas aquí, solo mostrar el overlay
    } else if (data.error) {
      mostrarMensaje(data.error, false);
    }
  }
}

// Muestra el CRUD en el overlay de confirmación
function mostrarOverlayCRUD(cita, mensaje) {
  const overlay = document.getElementById('overlayConfirmacion');
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  // Actualiza el contenido dinámico
  document.querySelector('#overlayConfirmacion h2').textContent = `✅ ${mensaje}`;
  document.getElementById('infoConfirmacion').innerHTML = `
    <p><strong>Usuario:</strong> ${cita.nombre}</p>
    <p><strong>Estilo de corte:</strong> ${cita.corte}</p>
    <p><strong>Hora seleccionada:</strong> ${cita.hora}</p>
  `;
  // Conectar botones
  document.getElementById('btnConfirmar').onclick = () => { confirmarCita(); };
  document.getElementById('btnEditar').onclick = () => { editarCita(); };
  document.getElementById('btnEliminar').onclick = () => { eliminarCita(); cerrarOverlay(); };
}

function cerrarOverlay() {
  const overlay = document.getElementById('overlayConfirmacion');
  overlay.classList.remove('flex');
  overlay.classList.add('hidden');
}