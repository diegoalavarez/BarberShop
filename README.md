# BarberShop

Sistema web para gestión de citas y clientes en una barbería. Permite a los usuarios registrarse, iniciar sesión, agendar citas, ver cortes de cabello y gestionar su perfil. Incluye autenticación con JWT y cookies, interfaz responsive y panel administrativo.

## Características principales
- Registro y login de usuarios con validación y verificación por correo.
- Autenticación segura con JWT y cookies httpOnly.
- CRUD de citas (agendar, editar, eliminar, confirmar).
- Visualización de cortes de cabello con imágenes y precios.
- Menú lateral responsive y botón hamburguesa en mobile.
- Panel de administración para gestión de usuarios y citas.
- Logout seguro y persistencia de sesión.
- Estilos modernos con TailwindCSS.

## Tecnologías utilizadas
- Node.js + Express
- MongoDB + Mongoose
- JWT + cookie-parser
- TailwindCSS
- Vanilla JS (frontend)
- Axios y Fetch API

## Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/diegoalavarez/BarberShop.git
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env`:
   ```env
   MONGO_URI=tu_uri_mongodb
   ACCESS_TOKEN_SECRET=tu_secreto_jwt
   EMAIL_USER=tu_email
   EMAIL_PASS=tu_password
   PAGE_URL=http://localhost:3000
   ```
4. Inicia el servidor:
   ```bash
   npm run dev
   ```
5. Accede a la app en `http://localhost:3000`

## Estructura del proyecto
```
Barbershop-Proyects/
├── app.js
├── index.js
├── config.js
├── package.json
├── controllers/
│   ├── appointments.js
│   ├── login.js
│   ├── logout.js
│   └── users.js
├── middleware/
│   └── auth.js
├── models/
│   ├── appointment.js
│   └── user.js
├── views/
│   ├── home/
│   ├── login/
│   ├── signup/
│   ├── haircuts/
│   ├── schedule/
│   └── components/
└── imgs/
```

## Uso
- Regístrate y verifica tu correo.
- Inicia sesión y agenda tu cita.
- Visualiza cortes de cabello y precios.
- Administra tus citas y perfil.

## Créditos
Desarrollado por diegoalavarez.

## Licencia
MIT
