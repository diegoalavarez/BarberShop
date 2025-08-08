const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginRouter.post('/', async (request, response) => {
    const { email, password } = request.body;
    const userExist = await User.findOne({ email });

    if (!userExist) {
        return response.status(400).json({ error: 'Email o contraseña incorrectos' });
    }

    if (!userExist.verified) {
        return response.status(400).json({ error: 'Email no verificado' });
    }

    const isCorrect = await bcrypt.compare(password, userExist.passwordHash);

    if (!isCorrect) {
        return response.status(400).json({ error: 'Email o contraseña incorrectos' });
    }

    const userForToken = { id: userExist._id.toString() };
    const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

    console.log('Token generado:', accessToken);

    const decoded = jwt.decode(accessToken);
    console.log('Payload del token:', decoded);

    response.cookie('accessToken', accessToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true
    });

    return response.status(200).json({ success: true });
});

module.exports = loginRouter;