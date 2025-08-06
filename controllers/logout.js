const logoutRouter = require('express').Router();

// Ruta para manejar el cierre de sesión
// Esta ruta elimina la cookie de acceso del usuario, lo que efectivamente cierra la sesión
// Si el usuario no está autenticado (no tiene una cookie de acceso), se devuelve un error 401 Unauthorized
logoutRouter.get('/', async (request, response) => {
    const cookies = request.cookies;
// verificar si el usuario esta autenticado
    if (!cookies?.accessToken) {
        return response.sendStatus(401);
    }

    // Elimina la cookie de acceso del usuario
    // Esto asegura que el usuario no pueda realizar acciones protegidas sin autenticación
    response.clearCookie('accessToken', {
    secure: process.env.NODE_ENV === 'production', // Asegura que la cookie solo se envíe a través de HTTPS en producción
    httpOnly: true // Hace que la cookie no sea accesible desde JavaScript del lado del cliente
    });

    return response.sendStatus(204); // No Content
});

module.exports = logoutRouter;