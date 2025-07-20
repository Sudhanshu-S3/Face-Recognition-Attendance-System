const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher.model.js');

exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token'
            });
        }

        // Verify token with consistent secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find teacher by id
        const teacher = await Teacher.findById(decoded.id).select('-password');
        if (!teacher) {
            return res.status(401).json({
                success: false,
                message: 'Teacher not found'
            });
        }

        req.teacher = teacher;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }
};