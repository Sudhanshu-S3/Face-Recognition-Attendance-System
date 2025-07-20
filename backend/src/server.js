const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const Grid = require('gridfs-stream');
const PORT = process.env.PORT || 5000;
dotenv.config();

const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Connect to MongoDB
const connectDB = require('./config/connectDB');
connectDB();

const { GridFSBucket } = require('mongodb');

// Initialize GridFS when MongoDB connection is open
let gfsBucket;
mongoose.connection.once('open', () => {
    gfsBucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'faceData'
    });
    console.log('GridFS ready');
    app.locals.gfsBucket = gfsBucket;
});

// Route definitions
const studentRoutes = require('./routes/student.route.js');
const attendanceRoutes = require('./routes/attendance.route.js');
const authRoutes = require('./routes/auth.route.js');

// Mount API routes
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);

// Error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

