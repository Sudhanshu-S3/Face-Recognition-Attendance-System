const mongoose = require('mongoose');

const studentDetailSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNo: { type: String, required: true },
    faceDataId: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' }, // Reference to GridFS file
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentDetailSchema);