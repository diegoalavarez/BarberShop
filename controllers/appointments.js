const Appointment = require('../models/appointment');

exports.getAppointments = async (req, res) => {
  try {
    console.log('Usuario autenticado:', req.userId); // <-- Agrega esto
    const appointments = await Appointment.find({ usuarioId: req.userId });
    console.log('Citas encontradas:', appointments); // <-- Y esto
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las citas.' });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { nombre, corte, hora } = req.body;
    const usuarioId = req.userId; // El id del usuario autenticado
    const appointment = new Appointment({ nombre, corte, hora, usuarioId });
    await appointment.save();
    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la cita.' });
  }
};



exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, corte, hora } = req.body;
    const usuarioId = req.userId;
    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, usuarioId }, // Solo permite editar citas propias
      { nombre, corte, hora },
      { new: true }
    );
    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cita.' });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.userId;
    await Appointment.findOneAndDelete({ _id: id, usuarioId }); // Solo permite eliminar citas propias
    res.json({ message: 'Cita eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la cita.' });
  }
};

exports.getAvailableHours = async (req, res) => {
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
};