const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// const multer = require('multer');
const path = require('path');
const { PAGE_URL } = require('../config');

// // Configura multer para guardar imágenes en /public/profile-pics
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '../public/profile-pics'));
//   },
//   filename: function (req, file, cb) {
//     // Usa el id del usuario y la extensión original
//     const ext = path.extname(file.originalname);
//     cb(null, req.userId + ext);
//   }
// });
// const upload = multer({ storage });

// Registro de usuario
// Ruta para registrar un nuevo usuario
// Esta ruta recibe los datos del usuario (nombre, email y contraseña) y crea un nuevo usuario en la base de datos
// Si el usuario ya existe, devuelve un error
// Si el registro es exitoso, envía un correo electrónico de verificación al usuario
// También genera un token de acceso que se puede usar para verificar el usuario más tarde
// Ruta para registrar un nuevo usuario
// Esta ruta recibe los datos del usuario (nombre, email y contraseña) y crea un nuevo usuario en la base de datos
// Si el usuario ya existe, devuelve un error
// Si el registro es exitoso, envía un correo electrónico de verificación al usuario
// También genera un token de acceso que se puede usar para verificar el usuario más tarde
usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) { // Verifica si todos los campos son proporcionados
        return response.status(400).json({error: 'Todos los campos son obligatorios' });
    }


    // Validación de email
    const userExist = await User.findOne({ email }); // Busca si el usuario ya existe en la base de datos
    //find one es un metodo para buscar en la base de datos.

    if (userExist) {
        return response.status(400).json({error: 'El email ya está en uso' });

    }

    const saltRounds = 10; // Número de rondas para el hash de la contraseña

    const passwordHash = await bcrypt.hash(password, saltRounds); // Hash de la contraseña
    const newUser = new User({
        name,
        email,
        passwordHash,
    })

    const savedUser = await newUser.save(); // Guarda el nuevo usuario en la base de datos
    const token = jwt.sign({ id: savedUser.id }, process.env.ACCESS_TOKEN_SECRET, { // Firmar el token con el ID del usuario
        expiresIn: '1d' // Expira en 1 día
    });

// Configuración del transportador de nodemailer para enviar correos electrónicos
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Cambia el host si es necesario 
        port: 465, // Cambia el puerto si es necesario
        secure: true, // true for 465, false for other ports
        auth: {
        user: process.env.EMAIL_USER, // Reemplaza con tu usuario de email
        pass: process.env.EMAIL_PASS, // Reemplaza con tu contraseña de email
    },
    });

// Envía un correo electrónico de bienvenida al nuevo usuario
    await transporter.sendMail({
        from: process.env.EMAIL_USER, // Remitente',
        to: savedUser.email, // Destinatario
        subject: 'Verificacion de usuario', // Asunto del correo
        html: `<a href="${PAGE_URL}/verify/${savedUser.id}/${token}">Verificar correo</a>`, // HTML body
    });
    
    return response.status(201).json('Usuario creado. Por favor verifica tu correo');
 


});

// Ruta para verificar el usuario mediante un token
usersRouter.patch('/:id/:token', async (request, response) => {
    try {
        const token = request.params.token; // Obtiene el token de la URL
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verifica el token
        const id = decodedToken.id; // Obtiene el ID del usuario desde el token;
        await User.findByIdAndUpdate(id, { verified: true });
        return response.sendStatus(200);

    } catch (error) {

        //Encontrar el email del usuario
        const id = request.params.id;
        const { email } = await User.findById(id); // Busca el usuario por ID
        
        //Firmar el nuevo token
        const token = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, { 
        expiresIn: '1d' // Expira en 1 día
    });

// Enviar un nuevo correo electrónico de verificación
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // Cambia el host si es necesario 
        port: 465, // Cambia el puerto si es necesario
        secure: true, // true for 465, false for other ports
        auth: {
        user: process.env.EMAIL_USER, // Reemplaza con tu usuario de email
        pass: process.env.EMAIL_PASS, // Reemplaza con tu contraseña de email
    },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER, // Remitente',
        to: email, // Destinatario
        subject: 'Verificacion de usuario', // Asunto del correo
        html: `<a href="${PAGE_URL}/verify/${id}/${token}">Verificar correo</a>`, // HTML body
    });
        
    
        return response.status(400).json({ error: 'Link ya expiro. Se ha enviado un nuevo link de verificacion a su correo.' });
    }

});

// Ruta para obtener el usuario autenticado
usersRouter.get('/me', async (req, res) => {
  try {
    // Debes tener un middleware que extraiga el userId del token/cookie
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

module.exports = usersRouter;