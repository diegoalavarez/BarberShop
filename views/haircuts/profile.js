// Script para foto de perfil
const profilePic = document.getElementById('profile-pic');
const profileInput = document.getElementById('profile-input');
const profilePicContainer = document.getElementById('profile-pic-container');

profilePicContainer.addEventListener('click', () => {
  profileInput.click();
});

profileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      profilePic.src = evt.target.result;
      // Aquí podrías guardar la imagen en el backend si lo deseas
    };
    reader.readAsDataURL(file);
  }
});
