
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    enrollmentNo: { type: String, required: true },
    date: { type: Date, default: Date.now },
    timestamp: { type: String, required: true }
});

module.exports = mongoose.model('Attendance', attendanceSchema);