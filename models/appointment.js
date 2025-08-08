const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  nombre: String,
  corte: String,
  hora: String,
  usuarioId: {
        type: mongoose.Schema.Types.ObjectId, // Almacena el ID del usuario que creó el todo
        ref: 'User' // Referencia al modelo User
    },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'eliminada'],
    default: 'pendiente'
  }

    });

    // Configura cómo se transforman los documentos al convertirlos a JSON
appointmentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // Convierte el campo _id a un string y lo renombra a id
        delete returnedObject._id; // Elimina el campo _id que es generado por MongoDB
        delete returnedObject.__v; // Elimina el campo __v que es usado por Mongoose para el control de versiones
    }

  });


// Crea el modelo de usuario basado en el esquema definido
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;