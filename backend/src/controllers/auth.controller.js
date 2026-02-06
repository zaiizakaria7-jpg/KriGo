const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * @desc    Enregistrer un nouvel utilisateur
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
    const { nom, prénom, email, téléphone, mot_de_passe } = req.body;

    // Validation des données d'entrée
    if (!nom || !prénom || !email || !téléphone || !mot_de_passe) {
        return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises.' });
    }

    if (mot_de_passe.length < 6) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères.' });
    }

    try {
        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // Créer un nouvel utilisateur (le mot de passe est hashé par le middleware pre-save du modèle)
        const user = await User.create({
            nom,
            prénom,
            email,
            téléphone,
            mot_de_passe
        });

        if (user) {
            res.status(201).json({
                message: "Utilisateur créé avec succès.",
                user: {
                    _id: user._id,
                    nom: user.nom,
                    email: user.email,
                    rôle: user.rôle
                }
            });
        } else {
            res.status(400).json({ message: 'Données utilisateur invalides.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error: error.message });
    }
};

/**
 * @desc    Connecter un utilisateur
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ message: 'Veuillez fournir un email et un mot de passe.' });
    }

    try {
        // Chercher l'utilisateur par email
        const user = await User.findOne({ email });

        // Si l'utilisateur existe et que le mot de passe correspond
        if (user && (await bcrypt.compare(mot_de_passe, user.mot_de_passe))) {
            // Générer un token JWT
            const token = jwt.sign(
                { id: user._id, rôle: user.rôle },
                process.env.JWT_SECRET,
                { expiresIn: '1h' } // Expiration dans 1 heure
            );

            res.json({
                message: "Connexion réussie.",
                token,
                user: {
                    _id: user._id,
                    nom: user.nom,
                    email: user.email,
                    rôle: user.rôle
                }
            });
        } else {
            // Retourner une erreur si les identifiants sont incorrects
            res.status(401).json({ message: 'Email ou mot de passe invalide.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
