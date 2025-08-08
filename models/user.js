const mongoose = require('mongoose'); // Importa mongoose para interactuar con MongoDB

// Define el esquema del modelo de usuario
const userSchema = new mongoose.Schema({ 
    name: String, // Almacena el nombre del usuario
    email: String, // Almacena el correo electrónico del usuario
    passwordHash: String, // Almacena el hash de la contraseña
    verified: { // Indica si el usuario ha verificado su cuenta
    type: Boolean,
    default: false
     }, 

    appointments: [{
        type: mongoose.Schema.Types.ObjectId, // Almacena el ID del usuario que creó el todo
        ref: 'Appointment' // Referencia al modelo Appointment
    }]
})

// Configura cómo se transforman los documentos al convertirlos a JSON
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // Convierte el campo _id a un string y lo renombra a id
        delete returnedObject._id; // Elimina el campo _id que es generado por MongoDB
        delete returnedObject.__v; // Elimina el campo __v que es usado por Mongoose para el control de versiones
        // delete returnedObject.passwordHash; // No enviar el hash de la contraseña
    }
});

// Crea el modelo de usuario basado en el esquema definido
const User = mongoose.model('User', userSchema);

module.exports = User;
