const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');

router.post('/take-attendance', attendanceController.takeAttendance);
router.get('/get-faces', attendanceController.getFace);
router.get('/get-face/:rollNo', attendanceController.getFaceData);

module.exports = router;