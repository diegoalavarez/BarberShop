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
    // Redirige o limpia el estado del frontend
    window.location.href = '/login/'; // O la ruta de tu login
  };
}

// Al cargar la página, pide los datos del usuario y actualiza la foto de perfil
async function cargarFotoPerfil() {
  try {
    const res = await fetch('/api/users/me', { credentials: 'include' });
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

// Aquí puedes agregar más funcionalidades JS para otros botones o interacciones