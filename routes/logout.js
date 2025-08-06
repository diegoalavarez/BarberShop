const logoutRouter = require('express').Router();

// Ruta para manejar el cierre de sesión
logoutRouter.get('/', (request, response) => {
    const cookies = request.cookies;

    // Verifica si el usuario está autenticado
    if (!cookies?.accessToken) {
        return response.sendStatus(401); // Unauthorized
    }

    // Elimina la cookie de acceso del usuario
    response.clearCookie('accessToken', {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
    });

    return response.sendStatus(204); // No Content
});

module.exports = logoutRouter;