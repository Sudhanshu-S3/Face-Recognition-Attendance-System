const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const Student = require('../models/Student.model.js');
const Attendance = require('../models/Attendance.model.js');


const getAttendanceDetail = async (req, res) => {
    try {
        const { date, studentName } = req.query;
        let query = {};

        // Add filters if provided
        if (date) {
            // Create date range for the given date (start of day to end of day)
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            query.date = { $gte: startDate, $lte: endDate };
        }

        if (studentName) {
            query.name = { $regex: studentName, $options: 'i' }; // Case-insensitive search
        }

        const attendanceRecords = await Attendance.find(query).sort({ date: -1 });
        res.json({ success: true, records: attendanceRecords });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance records'
        });
    }
}

const addStudentDetail = async (req, res) => {
    // Endpoint to capture face data and store in GridFS
    const { name, rollNo } = req.body;

    if (!name || !rollNo) {
        return res.status(400).json({
            success: false,
            message: 'Name and rollNo are required'
        });
    }
    const pythonScriptPath = path.join(__dirname, '../../../Attendance/addFaceScript.py');

    const pythonProcess = spawn('python', [pythonScriptPath, name, rollNo]);

    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    pythonProcess.on('close', async (code) => {
        if (code !== 0) {
            return res.status(500).json({
                success: false,
                message: 'Python script failed',
                details: errorData || 'Unknown error'
            });
        }

        try {
            const lines = outputData.split('\n').filter(line => line);
            const result = JSON.parse(lines[lines.length - 1]); // Last JSON line

            if (result.status !== 'success') {
                return res.status(500).json({
                    success: false,
                    message: 'Python script did not complete successfully'
                });
            }

            // Decode base64 face data
            const faceBuffer = Buffer.from(result.encodedFaces, 'base64');

            // Compress the data with zlib to save space
            const zlib = require('zlib');
            const compressed = zlib.gzipSync(faceBuffer);

            // Get the GridFS bucket from app.locals
            const gfsBucket = req.app.locals.gfsBucket;

            // Create a unique filename
            const filename = `face_${rollNo}_${Date.now()}.dat`;

            // Upload to GridFS
            const uploadStream = gfsBucket.openUploadStream(filename);
            uploadStream.end(compressed);

            // Wait for the upload to finish
            const fileId = await new Promise((resolve, reject) => {
                uploadStream.on('finish', () => resolve(uploadStream.id));
                uploadStream.on('error', reject);
            });

            // Create a new student record
            const student = new Student({
                name: result.name,
                rollNo: result.rollNo,
                faceDataId: fileId // Reference to the GridFS file
            });

            await student.save();

            res.status(200).json({
                success: true,
                message: 'Student added successfully',
                studentId: student._id
            });
        } catch (e) {
            console.error('Error processing face data:', e);
            res.status(500).json({
                success: false,
                message: 'Failed to process Python output or store in GridFS',
                details: e.message
            });
        }
    });

    pythonProcess.on('error', (err) => {
        res.status(500).json({
            success: false,
            message: 'Failed to spawn Python process',
            details: err.message
        });
    });
}

module.exports = {
    getAttendanceDetail,
    addStudentDetail
};





