const User = require('../models/user');

/**
 * @desc    Récupérer le profil de l'utilisateur connecté
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
    try {
        // req.user.id est défini par authMiddleware
        const user = await User.findById(req.user.id).select('-mot_de_passe');

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération du profil.' });
    }
};

module.exports = {
    getProfile
};
