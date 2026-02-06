const mongoose = require('mongoose');

/**
 * Schéma de l'agence pour la base de données MongoDB.
 */
const agencySchema = new mongoose.Schema({
    // Nom de l'agence, doit être unique
    name: {
        type: String,
        required: [true, 'Le nom de l\'agence est obligatoire.'],
        trim: true,
        unique: true
    },
    // Ville où se situe l'agence
    city: {
        type: String,
        required: [true, 'La ville de l\'agence est obligatoire.'],
        trim: true
    },
    // Statut de l'agence pour contrôler son activité
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    },
    // Propriétaire de l'agence, référençant un utilisateur avec le rôle 'admin_agence'
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Le propriétaire de l\'agence est obligatoire.']
        // Une validation supplémentaire pourrait être ajoutée au niveau du contrôleur
        // pour s'assurer que l'utilisateur référencé a bien le rôle 'admin_agence'.
    },
    // Liste des véhicules appartenant à l'agence
    vehicles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    }]
}, {
    // Active les timestamps pour suivre la création et la mise à jour
    timestamps: true
});

const Agency = mongoose.model('Agency', agencySchema);

module.exports = Agency;