const usersRouter= require('express').Router(); // Importa el enrutador de Express
const User = require('../models/user');
const bcrypt = require('bcrypt'); // Importa bcrypt para el hash de contraseñas
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken para manejar tokens JWT
const nodemailer = require('nodemailer'); // Importa nodemailer para enviar correos electrónicos
const {PAGE_URL} = require('../config'); // Importa la URL de la página desde la configuración

// Ruta para registrar un nuevo usuario
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
    const token = jwt.sign({ id: savedUser.id }, process.env.ACCESS_TOKEN_SECRET, { 
        expiresIn: '1d' // Expira en 1 día
    });

// Create a test account or replace with real credentials.
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
 

    console.error('Error al registrar el usuario', error)

     return res.status(500).json({ message: 'Error interno del servidor al crear el usuario.', error: error.message });

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

module.exports = usersRouter;