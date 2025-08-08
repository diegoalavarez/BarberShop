const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const { PAGE_URL } = require('../config');

// Configura multer para guardar imágenes en /public/profile-pics
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/profile-pics'));
  },
  filename: function (req, file, cb) {
    // Usa el id del usuario y la extensión original
    const ext = path.extname(file.originalname);
    cb(null, req.userId + ext);
  }
});
const upload = multer({ storage });

// Registro de usuario
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
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: savedUser.email,
      subject: 'Verificación de usuario',
      html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verificar correo</a>`,
    });
    console.log('Correo de verificación enviado a:', savedUser.email);
    console.log('Respuesta de Nodemailer:', info);

    return response.status(201).json({ message: 'Usuario creado. Por favor verifica tu correo.' });
  } catch (error) {
    console.error('Error al registrar el usuario', error);
    return response.status(500).json({ error: 'Error interno del servidor al crear el usuario.', detail: error.message });
  }
});

// Verificación de usuario
usersRouter.patch('/:id/:token', async (request, response) => {
  try {
    const token = request.params.token;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const id = decodedToken.id;
    const user = await User.findById(id);

    if (!user) {
      return response.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (user.verified) {
      return response.status(200).json({ message: 'Usuario ya verificado.' });
    }

    await User.findByIdAndUpdate(id, { verified: true });
    return response.status(200).json({ message: 'Usuario verificado correctamente.' });
  } catch (error) {
    // Si el token expiró o es inválido, reenviar un nuevo correo de verificación
    try {
      const id = request.params.id;
      const user = await User.findById(id);
      if (!user) {
        return response.status(404).json({ error: 'Usuario no encontrado' });
      }
      if (user.verified) {
        return response.status(200).json({ message: 'Usuario ya verificado.' });
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

      return response.status(400).json({ error: 'Link expirado. Se ha enviado un nuevo link de verificación a su correo.' });
    } catch (err) {
      console.error('Error al reenviar el correo de verificación', err);
      return response.status(500).json({ error: 'Error interno al reenviar el correo de verificación.' });
    }
  }
});

// Ruta para subir foto de perfil
usersRouter.post('/profile-pic', upload.single('profilePic'), async (req, res) => {
  try {
    // Guarda la ruta de la imagen en el usuario
    const imageUrl = `/profile-pics/${req.userId}${path.extname(req.file.originalname)}`;
    await User.findByIdAndUpdate(req.userId, { profilePic: imageUrl });
    res.json({ message: 'Foto actualizada', imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la foto de perfil' });
  }
});

module.exports = usersRouter;