const jwt = require('jsonwebtoken');
const User = require('../models/user');



const userExtractor = async (request, response, next) => {
  try {
    let token = null;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
      token = request.headers.authorization.replace('Bearer ', '');
    } else if (request.cookies?.accessToken) {
      token = request.cookies.accessToken;
    }
    console.log('TOKEN RECIBIDO:', token);
    if (!token) {
      return response.status(401).json({ error: 'Token faltante' });
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('DECODED:', decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      return response.status(401).json({ error: 'Usuario no encontrado' });
    }
    request.user = user;
    request.userId = user._id;
    next();
  } catch (error) {
    console.error('ERROR JWT:', error);
    return response.status(403).json({ error: 'Token inválido' });
  }
};


module.exports = { userExtractor };