require('dotenv').config();
const express = require('express'); 
const app = express();
const mongoose = require('mongoose');
const path = require('path');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_TEST)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        
    }
})();

// Rutas front-end
app.use('/', express.static(path.resolve('views', 'home')))
module.exports = app;