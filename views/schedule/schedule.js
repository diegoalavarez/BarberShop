document.addEventListener("DOMContentLoaded", () => {
  llenarHorario();

  const boton = document.getElementById("botonAgendar");
  if (boton) boton.addEventListener("click", agendar);
});

function llenarHorario() {
  const horaSelect = document.getElementById("hora");
  for (let h = 9; h <= 21; h++) {
    const display = h <= 12 ? `${h}am` : `${h - 12}pm`;
    const opt = document.createElement("option");
    opt.value = display;
    opt.textContent = display;
    horaSelect.appendChild(opt);
  }
}

function agendar() {
  const nombre = document.getElementById("nombre").value.trim();
  const corte = document.getElementById("corte").value;
  const hora = document.getElementById("hora").value;

  if (!nombre || !corte || !hora) {
    alert("Por favor completa todos los campos.");
    return;
  }

  // Mostrar tarjeta interna
  const tarjeta = document.getElementById("tarjeta");
  tarjeta.classList.remove("hidden");
  tarjeta.innerHTML = `
    <h3 class="text-xl font-bold mb-2">✅ Cita Confirmada</h3>
    <p><strong>Usuario:</strong> ${nombre}</p>
    <p><strong>Estilo de corte:</strong> ${corte}</p>
    <p><strong>Hora seleccionada:</strong> ${hora}</p>
  `;

  // Mostrar overlay flotante con fade-in
  const overlay = document.getElementById("overlayConfirmacion");
  const info = document.getElementById("infoConfirmacion");
  info.innerHTML = `
    <p><strong>Usuario:</strong> ${nombre}</p>
    <p><strong>Estilo de corte:</strong> ${corte}</p>
    <p><strong>Hora seleccionada:</strong> ${hora}</p>
  `;
  overlay.classList.remove("hidden");
}

function cerrarConfirmacion() {
  document.getElementById("overlayConfirmacion").classList.add("hidden");
}

function cerrarTarjeta() {
  document.getElementById("tarjeta").classList.add("hidden");
  document.getElementById("nombre").value = "";
  document.getElementById("corte").value = "";
  document.getElementById("hora").value = "";
}