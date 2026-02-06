const mongoose = require('mongoose');

// Définition du schéma pour les véhicules
const vehicleSchema = new mongoose.Schema({
    // Marque du véhicule (ex: Peugeot, Renault)
    brand: {
        type: String,
        required: [true, 'La marque du véhicule est obligatoire.'] ,
        trim: true
    },
    // Modèle du véhicule (ex: 208, Clio)
    model: {
        type: String,
        required: [true, 'Le modèle du véhicule est obligatoire.'] ,
        trim: true
    },
    // Année de fabrication
    year: {
        type: Number,
        required: [true, 'L\'année du véhicule est obligatoire.'] ,
        min: [1990, 'L\'année de fabrication doit être supérieure à 1990.']
    },
    // Type de véhicule (ex: Citadine, SUV, Berline)
    type: {
        type: String,
        required: [true, 'Le type de véhicule est obligatoire.'] ,
        enum: ['Citadine', 'SUV', 'Berline', 'Sportive', 'Utilitaire']
    },
    // Prix de la location par jour
    daily_rate: {
        type: Number,
        required: [true, 'Le tarif journalier est obligatoire.']
    },
    // Statut de disponibilité du véhicule
    is_available: {
        type: Boolean,
        default: true
    }
}, {
    // Active les timestamps (createdAt et updatedAt)
    timestamps: true
});

// Création du modèle 'Vehicle' à partir du schéma
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
