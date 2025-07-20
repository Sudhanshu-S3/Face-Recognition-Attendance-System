const Teacher = require('../models/Teacher.model.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET , {
        expiresIn: '7d'
    });
};

// Register a new teacher
exports.signup = async (req, res) => {
    try {
        //Destructure the request
        const { name, email, password, department } = req.body;

        // Check if teacher already exists
        const teacherExists = await Teacher.findOne({ email });
        if (teacherExists) {
            return res.status(400).json({
                success: false,
                message: 'Teacher with this email already exists'
            });
        }

        // Create new teacher
        const teacher = await Teacher.create({
            name,
            email,
            password,
            department
        });

        // Generate token
        const token = generateToken(teacher._id);

        res.status(201).json({
            success: true,
            message: 'Teacher registered successfully',
            token,
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                department: teacher.department
            }
        });
    } catch (error) {
        //error gives in console in red color
        console.error('Teacher signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering teacher'
        });
    }
};

// Teacher login
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find teacher by email
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email'
            });
        }

        // Check password
        const isPasswordMatch = await teacher.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Generate token
        const token = generateToken(teacher._id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                department: teacher.department
            }
        });
    } catch (error) {
        console.error('Teacher signin error:', error);
        res.status(500).json({
            success: false,
            message: 'Error signing in'
        });
    }
};
