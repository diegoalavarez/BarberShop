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

// Cambiar foto de perfil
const profilePicContainer = document.getElementById('profile-pic-container');
const profileInput = document.getElementById('profile-input');
const profilePic = document.getElementById('profile-pic');

profilePicContainer.addEventListener('click', () => {
  profileInput.click();
});

profileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('profilePic', file);

    // Envía la imagen al backend
    const res = await fetch('/api/users/profile-pic', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    // Actualiza la imagen en el frontend
    const reader = new FileReader();
    reader.onload = function(evt) {
      profilePic.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Logout
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
  btnLogout.onclick = async function() {
    await fetch('/api/logout', {
      method: 'GET',
      credentials: 'include'
    });
    // Redirige a la vista de login después de cerrar sesión
    window.location.href = '/login';
  };
}

// Al cargar la página, pide los datos del usuario y actualiza la foto de perfil
async function cargarFotoPerfil() {
  try {
    const res = await fetch('/api/users/me', { credentials: 'include' });
    console.log('Cookies en haircuts.js:', document.cookie); // <-- LOG
    if (!res.ok) {
      throw new Error('No autorizado');
    }
    const user = await res.json();
    if (user.profilePic) {
      profilePic.src = user.profilePic;
    }
  } catch (error) {
    console.error('No se pudo cargar la foto de perfil:', error);
  }
}

// Llama a la función al iniciar
cargarFotoPerfil();

async function verificarSesion() {
  try {
    const res = await fetch('/api/users/me', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      document.body.insertAdjacentHTML('afterbegin', `<div style="position:fixed;top:0;left:0;width:100%;background:green;color:white;padding:8px;z-index:9999;text-align:center;">Sesión activa: ${data.user.name || data.user.email}</div>`);
    } else {
      document.body.insertAdjacentHTML('afterbegin', `<div style="position:fixed;top:0;left:0;width:100%;background:red;color:white;padding:8px;z-index:9999;text-align:center;">No hay sesión activa</div>`);
    }
  } catch (e) {
    document.body.insertAdjacentHTML('afterbegin', `<div style="position:fixed;top:0;left:0;width:100%;background:red;color:white;padding:8px;z-index:9999;text-align:center;">Error de conexión</div>`);
  }
}
verificarSesion();

// Aquí puedes agregar más funcionalidades JS para otros botones o interacciones