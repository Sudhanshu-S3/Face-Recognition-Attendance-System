// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

module.exports = router;
