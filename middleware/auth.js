const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware para extraer el usuario del token JWT
const userExtractor = (request, response, next) => {
  try {
    let token = null;
    console.log('Cookies recibidas:', request.cookies); // <-- LOG
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
      token = request.headers.authorization.replace('Bearer ', '');
    } else if (request.cookies && request.cookies.accessToken) {
      token = request.cookies.accessToken;
    }
    console.log('Token extraído:', token); // <-- LOG
    if (!token) {
      return response.status(401).json({ error: 'Token faltante' }); // Si no hay token, devuelve un error 401 (No autorizado)
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verifica el token usando la clave secreta
    console.log('Token decodificado:', decoded); // <-- LOG
    request.userId = decoded.id;
    next();
  } catch (error) { // Si hay un error al verificar el token, devuelve un error 403 (Prohibido)
    console.log('Error al verificar token:', error); // <-- LOG
    return response.status(403).json({ error: 'Token inválido' });
  }
};

module.exports = { userExtractor };