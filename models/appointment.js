const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  nombre: String,
  corte: String,
  hora: String,
  usuarioId: String
});

module.exports = mongoose.model('Appointment', appointmentSchema);