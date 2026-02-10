const express = require('express');
const router = express.Router();
const { getProfile, getAllUsers, createUser, updateUser, deleteUser, updateProfile } = require('../controllers/user.controller');
const { isAuth } = require('../middlewares/auth.middleware');
const { isSuperAdmin } = require('../middlewares/role.middleware');

// Route pour récupérer le profil (protégée)
router.get('/profile', isAuth, getProfile);

// Update profile
router.put('/profile', isAuth, updateProfile);

// Upload profile picture
const upload = require('../middlewares/upload.middleware');
router.post('/upload-avatar', isAuth, upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
});

// Security Routes
const securityController = require('../controllers/security.controller');
router.put('/change-password', isAuth, securityController.changePassword);
router.post('/2fa/generate', isAuth, securityController.generate2FA);
router.post('/2fa/enable', isAuth, securityController.verifyAndEnable2FA);
router.post('/2fa/disable', isAuth, securityController.disable2FA);
router.delete('/account', isAuth, securityController.deleteAccount);

// Routes for CRUD users (Super Admin only)
router.get('/', isAuth, isSuperAdmin, getAllUsers);
router.post('/', isAuth, isSuperAdmin, createUser);
router.put('/:id', isAuth, isSuperAdmin, updateUser);
router.delete('/:id', isAuth, isSuperAdmin, deleteUser);

module.exports = router;
