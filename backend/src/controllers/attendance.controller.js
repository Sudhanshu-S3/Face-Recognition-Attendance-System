const Attendance = require('../models/Attendance.model.js');
const Student = require('../models/Student.model.js');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const takeAttendance = async (req, res) => {
    const pythonScriptPath = path.join(__dirname, '../../../Attendance/attendanceScript.py');
    const haarCascadePath = path.join(__dirname, '../../../Attendance/haarcascade_frontalface_default.xml');

    const pythonProcess = spawn('python', [pythonScriptPath, haarCascadePath]);

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
            const result = JSON.parse(outputData.trim()); // Expect single JSON output

            if (result.status === 'no_detection') {
                return res.status(400).json({
                    success: false,
                    message: 'No face detected during the session'
                });
            }

            if (result.status !== 'success') {
                return res.status(500).json({
                    success: false,
                    message: 'Python script did not complete successfully',
                    details: result.error || 'Unknown error'
                });
            }

            const attendanceData = result.attendance;
            const attendance = new Attendance({
                name: attendanceData.name,
                enrollmentNo: attendanceData.enrollmentNo,
                timestamp: attendanceData.timestamp,
                date: new Date()
            });

            await attendance.save();

            res.status(201).json({
                success: true,
                message: 'Attendance marked successfully',
                details: attendanceData
            });
        } catch (e) {
            console.error('Error processing attendance data:', e);
            res.status(500).json({
                success: false,
                message: 'Failed to process Python output or mark attendance',
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
};

const getFace = async (req, res) => {
    try {
        const students = await Student.find({});
        const names = [];
        const faces_data = [];
        const Eroll = [];

        for (const student of students) {
            if (student.faceDataId) {
                try {
                    const gfsBucket = req.app.locals.gfsBucket;
                    const downloadStream = gfsBucket.openDownloadStream(student.faceDataId);

                    const chunks = [];
                    for await (const chunk of downloadStream) {
                        chunks.push(chunk);
                    }

                    const buffer = Buffer.concat(chunks);
                    const zlib = require('zlib');
                    const decompressed = zlib.unzipSync(buffer);

                    // The key fix: reshape the decompressed data to the expected format
                    // We're assuming faces are stored as 50x50 RGB images
                    // Need to extract just the required amount of data
                    const faceArray = [];

                    // Create a flat array of the proper size (7500 = 50*50*3)
                    for (let i = 0; i < 7500 && i < decompressed.length; i++) {
                        faceArray.push(decompressed[i]);
                    }

                    // Make sure we have exactly 7500 elements
                    if (faceArray.length === 7500) {
                        names.push(student.name);
                        faces_data.push(faceArray); // This will now be the expected size
                        Eroll.push(student.rollNo);
                    } else {
                        console.warn(`Skipping face data for ${student.name}: incorrect size ${faceArray.length}`);
                    }
                } catch (error) {
                    console.error(`Error processing face data for student ${student._id}:`, error);
                }
            }
        }

        res.json({
            success: true,
            names,
            faces_data,
            Eroll
        });
    } catch (error) {
        console.error('Error fetching face data:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving face data'
        });
    }
};

// getFaceData remains unchanged but could set content type
const getFaceData = async (req, res) => {
    try {
        const student = await Student.findOne({ rollNo: req.params.rollNo });
        if (!student || !student.faceDataId) {
            return res.status(404).json({
                success: false,
                message: 'Face data not found'
            });
        }

        const gfsBucket = req.app.locals.gfsBucket;
        res.set('Content-Type', 'application/octet-stream');
        const downloadStream = gfsBucket.openDownloadStream(student.faceDataId);
        downloadStream.pipe(res);

        downloadStream.on('error', (err) => {
            res.status(500).json({
                success: false,
                message: 'Error retrieving file',
                details: err.message
            });
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            details: e.message
        });
    }
};

module.exports = { takeAttendance, getFace, getFaceData };