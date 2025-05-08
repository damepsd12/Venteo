
const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');
const { loginUser } = require('../controllers/authController');

// Route d'inscription
router.post('/register', registerUser);
// Route pour la connexion
router.post('/login', loginUser);

module.exports = router;
