const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware para extraer el usuario del token JWT
const userExtractor = (request, response, next) => {
  try {
    let token = null;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
      token = request.headers.authorization.replace('Bearer ', '');
    } else if (request.cookies && request.cookies.accessToken) {
      token = request.cookies.accessToken;
    }
    if (!token) {
      return response.status(401).json({ error: 'Token faltante' }); // Si no hay token, devuelve un error 401 (No autorizado)
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verifica el token usando la clave secreta
    request.userId = decoded.id;
    next();
  } catch (error) { // Si hay un error al verificar el token, devuelve un error 403 (Prohibido)
    return response.status(403).json({ error: 'Token inválido' });
  }
};

module.exports = { userExtractor };