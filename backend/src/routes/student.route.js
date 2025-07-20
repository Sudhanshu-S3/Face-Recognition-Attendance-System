const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');

// Existing routes

router.get('/download-Attendance', studentController.getAttendanceDetail);
router.post('/add-student', studentController.addStudentDetail);


module.exports = router;