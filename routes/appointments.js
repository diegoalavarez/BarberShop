const express = require('express');
const router = express.Router();
const appointmentsCtrl = require('../controllers/appointments');

router.post('/', appointmentsCtrl.createAppointment);
router.get('/', appointmentsCtrl.getAppointments);
router.put('/:id', appointmentsCtrl.updateAppointment);
router.delete('/:id', appointmentsCtrl.deleteAppointment);

module.exports = router;