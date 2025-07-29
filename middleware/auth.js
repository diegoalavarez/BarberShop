const jwt = require('jsonwebtoken');
const User = require('../models/user');



const userExtractor = async (request, response, next) => {
    try {
        const token = request.cookies?.accessToken;
        if (!token) {
            return response.sendStatus(401).json({ error: 'Token faltante' });
    }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        request.user = user;
        
        if (!user) {
            return response.sendStatus(401).json({ error: 'Usuario no encontrado' });
        }

        next();
     
    } catch (error) {
        return response.sendStatus(403).json({ error: 'Token inválido' });
    }
    


};


module.exports = { userExtractor };