const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/user.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Route pour récupérer le profil (protégée)
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
