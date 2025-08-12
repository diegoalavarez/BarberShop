// Menú responsive hamburguesa
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
  });
  // Cerrar menú al hacer click fuera del sidebar
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 768 && sidebar.classList.contains('-translate-x-full') === false) {
      if (!sidebar.contains(e.target) && e.target !== menuToggle) {
        sidebar.classList.add('-translate-x-full');
      }
    }
  });
}
// Redirección a schedule
document.getElementById('btn-schedule').addEventListener('click', () => {
  window.location.href = '/schedule/';
});

// Redirección a WhatsApp
document.getElementById('btn-whatsapp').addEventListener('click', () => {
  const numero = '584241274743';
  const mensaje = encodeURIComponent('¡Hola! Quiero información sobre cortes de cabello.');
  window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
});

const profilePic = document.getElementById('profile-pic');
const userName = document.getElementById('user-name');

// Al cargar la página, pide los datos del usuario y muestra el nombre
async function cargarDatosUsuario() {
  try {
    const res = await fetch('/api/users/me', { credentials: 'include' });
    if (!res.ok) {
      throw new Error('No autorizado');
    }
    const user = await res.json();
    if (user.user && user.user.name) {
      userName.textContent = user.user.name;
    } else if (user.user && user.user.email) {
      userName.textContent = user.user.email;
    } else {
      userName.textContent = 'Usuario';
    }
  } catch (error) {
    userName.textContent = '';
    console.error('No se pudo cargar el nombre de usuario:', error);
  }
}

cargarDatosUsuario();

async function verificarSesion() {
  try {
    const res = await fetch('/api/users/me', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      // Sesión activa, pero no mostrar aviso
    } else {
      // No hay sesión activa, pero no mostrar aviso
    }
  } catch (e) {
    document.body.insertAdjacentHTML('afterbegin', `<div style="position:fixed;top:0;left:0;width:100%;background:red;color:white;padding:8px;z-index:9999;text-align:center;">Error de conexión</div>`);
  }
}
verificarSesion();

// Aquí puedes agregar más funcionalidades JS para otros botones o interacciones