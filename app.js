require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const { MONGO_URI_TEST} = require('./confi'); // Importar la URI de conexión a MongoDB desde el archivo de configuración

(async () => {
    try {
        await mongoose.connect(MONGO_URI_TEST)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        
    }
})();

// Rutas front-end
app.use('/', express.static(path.resolve('views', 'home')));
app.use('/styles', express.static(path.resolve('views', 'styles')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/imgs', express.static(path.resolve('imgs')));
app.use('/verify/:id/:token', express.static(path.resolve('views', 'verify')));
app.use('/haircuts', express.static(path.resolve('views', 'haircuts')));
app.use('/schedule', express.static(path.resolve('views', 'schedule')));
app.use('/options', express.static(path.resolve('views', 'options')));

// Middlewares para parsear el body (deben ir antes de las rutas)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas Backend
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);


module.exports = app;
