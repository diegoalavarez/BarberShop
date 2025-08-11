const express = require('express');
const appointmentsRouter = express.Router();
const Appointment = require('../models/appointment');
const { userExtractor } = require('../middleware/auth');

// Obtener citas del usuario autenticado
appointmentsRouter.get('/', userExtractor, async (req, res) => {
  try {
    const appointments = await Appointment.find({ usuarioId: req.userId, estado: { $ne: 'eliminada' } });
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las citas.' });
  }
});

// Crear cita
appointmentsRouter.post('/', userExtractor, async (req, res) => {
  try {
    const { nombre, corte, hora } = req.body;
    const usuarioId = req.userId;
    const appointment = new Appointment({ nombre, corte, hora, usuarioId, estado: 'pendiente' });
    await appointment.save();
    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la cita.' });
  }
});

// Actualizar cita
appointmentsRouter.put('/:id', userExtractor, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, corte, hora, estado } = req.body;
    const usuarioId = req.userId;
    const updateFields = {};
    if (nombre) updateFields.nombre = nombre;
    if (corte) updateFields.corte = corte;
    if (hora) updateFields.hora = hora;
    if (estado) updateFields.estado = estado;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, usuarioId },
      updateFields,
      { new: true }
    );
    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cita.' });
  }
});

// Eliminar cita
appointmentsRouter.delete('/:id', userExtractor, async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.userId;
    await Appointment.findOneAndUpdate({ _id: id, usuarioId }, { estado: 'eliminada' });
    res.json({ message: 'Cita eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la cita.' });
  }
});

// Horas disponibles
appointmentsRouter.get('/available-hours', userExtractor, async (req, res) => {
  try {
    const citasPendientes = await Appointment.find({ estado: { $ne: 'eliminada' } });
    const horasReservadas = citasPendientes.map(cita => cita.hora);
    const todasLasHoras = [
      "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
      "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
      "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"
    ];
    const horasDisponibles = todasLasHoras.filter(hora => !horasReservadas.includes(hora));
    res.json({ horas: horasDisponibles });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las horas disponibles.' });
  }
});

module.exports = appointmentsRouter;