const textInfo = document.querySelector('#text-info');

(async () => { 
  try {
    const parts = window.location.pathname.split('/'); 
    if (parts.length < 4) {
      textInfo.innerHTML = 'URL de verificación inválida.';
      return;
    }
    const token = parts[3]; 
    const id = parts[2]; 
    const { data } = await axios.patch(`/api/users/${id}/${token}`);
    textInfo.innerHTML = data.message || 'Cuenta verificada correctamente.';
    setTimeout(() => {
      window.location.pathname = '/login';
    }, 2000);
  } catch (error) {
    textInfo.innerHTML = error.response?.data?.error || 'Error de verificación.';
  }
})();