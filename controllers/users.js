const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { PAGE_URL } = require('../config');

// Ruta para registrar un nuevo usuario
usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return response.status(400).json({ error: 'El email ya está en uso' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name,
      email,
      passwordHash,
      verified: false
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

    // Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Enviar correo de verificación
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: savedUser.email,
      subject: 'Verificación de usuario',
      html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verificar correo</a>`,
    });

    return response.status(201).json('Usuario creado. Por favor verifica tu correo');
  } catch (error) {
    console.error('Error al registrar el usuario', error);
    return response.status(500).json({ message: 'Error interno del servidor al crear el usuario.', error: error.message });
  }
});

// Ruta para verificar el usuario mediante un token
usersRouter.patch('/:id/:token', async (request, response) => {
  try {
    const token = request.params.token;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const id = decodedToken.id;
    await User.findByIdAndUpdate(id, { verified: true });
    return response.sendStatus(200);
  } catch (error) {
    // Si el token expiró o es inválido, reenviar un nuevo correo de verificación
    try {
      const id = request.params.id;
      const user = await User.findById(id);
      if (!user) {
        return response.status(404).json({ error: 'Usuario no encontrado' });
      }
      const newToken = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Verificación de usuario',
        html: `<a href="${PAGE_URL}/verify/${id}/${newToken}">Verificar correo</a>`,
      });

      return response.status(400).json({ error: 'Link ya expiró. Se ha enviado un nuevo link de verificación a su correo.' });
    } catch (err) {
      console.error('Error al reenviar el correo de verificación', err);
      return response.status(500).json({ error: 'Error interno al reenviar el correo de verificación.' });
    }
  }
});

module.exports = usersRouter;