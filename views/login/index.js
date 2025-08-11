const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const form = document.querySelector('#form');
const errorText = document.querySelector('#error-text');

form.addEventListener('submit', async e => {
    e.preventDefault();

    try {
        const user = {
        email: emailInput.value,
        password: passwordInput.value
    }
    await axios.post('/api/login', user, { withCredentials: true });
    // Mostrar cookies justo después del login
    setTimeout(() => {
      console.log('Cookies después de login:', document.cookie);
      window.location.href = '/haircuts/'; // Usar href para recarga completa
    }, 500);
    // window.location.pathname = `/haircuts/`;
    }
    catch (error) {
        console.log(error);
        errorText.innerHTML = error.response?.data?.error || 'Error de conexión o credenciales incorrectas.';
}
    
    });

async function verificarSesionLogin() {
  try {
    const res = await fetch('/api/users/me', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      document.body.insertAdjacentHTML('afterbegin', `<div style="position:fixed;top:0;left:0;width:100%;background:green;color:white;padding:8px;z-index:9999;text-align:center;">Sesión activa: ${data.user.name || data.user.email}</div>`);
    } else {
    // No mostrar aviso si no hay sesión activa
    }
  } catch (e) {
    document.body.insertAdjacentHTML('afterbegin', `<div style="position:fixed;top:0;left:0;width:100%;background:red;color:white;padding:8px;z-index:9999;text-align:center;">Error de conexión</div>`);
  }
}
verificarSesionLogin();

console.log('Cookies en el navegador:', document.cookie);