const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  nombre: String,
  corte: String,
  hora: String,
  // Puedes agregar más campos si lo necesitas
});

module.exports = mongoose.model('Appointment', appointmentSchema);