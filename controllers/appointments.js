const Appointment = require('../models/appointment');

exports.createAppointment = async (req, res) => {
  try {
    const { nombre, corte, hora } = req.body;
    const appointment = new Appointment({ nombre, corte, hora });
    await appointment.save();
    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la cita.' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las citas.' });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, corte, hora } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      id,
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
    await Appointment.findByIdAndDelete(id);
    res.json({ message: 'Cita eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la cita.' });
  }
};