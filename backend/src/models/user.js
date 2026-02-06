const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schéma de l'utilisateur pour la base de données MongoDB.
 */
const userSchema = new mongoose.Schema({
    // Nom de l'utilisateur
    nom: {
        type: String,
        required: [true, 'Le nom est obligatoire.'],
        trim: true
    },
    // Prénom de l'utilisateur
    prénom: {
        type: String,
        required: [true, 'Le prénom est obligatoire.'],
        trim: true
    },
    // Email unique et obligatoire pour la connexion
    email: {
        type: String,
        required: [true, 'L\'email est obligatoire.'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Veuillez entrer un email valide.']
    },
    // Numéro de téléphone de l'utilisateur
    téléphone: {
        type: String,
        required: [true, 'Le numéro de téléphone est obligatoire.'],
        trim: true
    },
    // Mot de passe qui sera hashé
    mot_de_passe: {
        type: String,
        required: [true, 'Le mot de passe est obligatoire.'],
        minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères.']
    },
    // Rôle de l'utilisateur pour la gestion des accès
    rôle: {
        type: String,
        enum: ['visitor', 'user', 'admin_agence', 'super_admin'],
        default: 'user'
    }
}, {
    // Active les timestamps pour suivre la création et la mise à jour
    timestamps: true
});

/**
 * Middleware pre-save pour hasher le mot de passe avant de l'enregistrer.
 * Le mot de passe n'est hashé que s'il a été modifié.
 */
userSchema.pre('save', async function(next) {
    if (!this.isModified('mot_de_passe')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;