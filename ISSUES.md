# 🚗 KriGo - Suivi du Projet de Location de Véhicules

Ce fichier documente la structure complète du projet, les tâches accomplies et les accords techniques.

---

## 📁 Structure du Projet

```
KriGo/
├── 📄 .env                     # Variables d'environnement
├── 📄 .gitignore               # Fichiers ignorés par Git
├── 📄 package.json             # Dépendances NPM
├── 📄 server.js                # Point d'entrée principal
├── 📄 check_ids.js             # Script de vérification des IDs
├── 📄 debug_vehicles.js        # Script de debug véhicules
│
└── 📂 backend/
    ├── 📄 app.js               # Configuration Express
    ├── 📄 get_agency_id.js     # Utilitaire pour récupérer l'ID agence
    │
    └── 📂 src/
        ├── 📂 config/          # Configuration (DB, etc.)
        │
        ├── 📂 models/          # Modèles MongoDB
        │   ├── 📄 user.js
        │   ├── 📄 Vehicle.js
        │   ├── 📄 Reservation.js
        │   └── 📄 Agency.js
        │
        ├── 📂 controllers/     # Logique métier
        │   ├── 📄 controller.js
        │   ├── 📄 vehicle.controller.js
        │   ├── 📄 reservation.controller.js
        │   ├── 📄 agency.controller.js
        │   └── 📄 dashboard.controller.js
        │
        ├── 📂 routes/          # Routes API
        │   ├── 📄 routes.js
        │   ├── 📄 auth.routes.js
        │   ├── 📄 vehicle.routes.js
        │   ├── 📄 reservation.routes.js
        │   ├── 📄 agency.routes.js
        │   └── 📄 dashboard.routes.js
        │
        ├── 📂 middlewares/     # Middlewares (Auth, etc.)
        │
        └── 📂 img/             # Images uploadées
```

---

## 🤝 Tâches Communes & Accords (Convention)

| Convention | Valeur | Status |
|------------|--------|--------|
| **Naming des rôles** | `["user", "agency_admin", "super_admin"]` | ✅ |
| **Status Reservation** | `["pending", "accepted", "refused", "cancelled"]` | ✅ |
| **Format de Date** | ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`) | ✅ |
| **Format de Réponse JSON** | `{ success: true, data: ..., message: ... }` | ✅ |

---

## 👤 Authentification & Utilisateurs

| Fonctionnalité | Route | Status |
|----------------|-------|--------|
| **Register** | `POST /api/auth/register` | ✅ |
| **Login** | `POST /api/auth/login` | ✅ |
| **Get Profile** | `GET /api/auth/profile` | ✅ |
| **OAuth Google** | `/api/auth/google` | ✅ |
| **OAuth Facebook** | `/api/auth/facebook` | ✅ |

---

## 🏢 Agences

| Fonctionnalité | Route | Status |
|----------------|-------|--------|
| **Créer Agence** | `POST /api/agencies` | ✅ |
| **Lister Agences** | `GET /api/agencies` | ✅ |
| **Détails Agence** | `GET /api/agencies/:id` | ✅ |

---

## 🚘 Modèles (Models)

### Vehicle Model
| Champ | Type | Description |
|-------|------|-------------|
| `type` | String | `car`, `moto`, `trottinette` |
| `brand` | String | Marque du véhicule |
| `model` | String | Modèle du véhicule |
| `price_per_day` | Number | Prix par jour |
| `availability` | Boolean | Disponibilité (default: true) |
| `agency` | ObjectId | Relation vers Agency |
| `image` | String | URL de l'image |
| `description` | String | Description du véhicule |

### Reservation Model
| Champ | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId | Relation vers User |
| `vehicleId` | ObjectId | Relation vers Vehicle |
| `startDate` | Date | Date de début |
| `endDate` | Date | Date de fin |
| `status` | String | `pending`, `accepted`, `refused`, `cancelled` |
| `totalPrice` | Number | Prix total calculé |

---

## 🚙 Gestion des Véhicules (Vehicles Management)

| Fonctionnalité | Route | Accès | Status |
|----------------|-------|-------|--------|
| **Add Vehicle** | `POST /api/vehicles` | Admin Agence | ✅ |
| **Edit Vehicle** | `PUT /api/vehicles/:id` | Admin Agence | ✅ |
| **Delete Vehicle** | `DELETE /api/vehicles/:id` | Admin Agence | ✅ |
| **List Vehicles** | `GET /api/vehicles` | Public | ✅ |
| **Get Vehicle** | `GET /api/vehicles/:id` | Public | ✅ |

**Filtres disponibles :** City, Type, Price, Brand

---

## � Réservations (Reservations)

| Fonctionnalité | Route | Accès | Status |
|----------------|-------|-------|--------|
| **Create Reservation** | `POST /api/reservations` | User | ✅ |
| **Check Availability** | `POST /api/reservations/check` | Public | ✅ |
| **Accept/Refuse** | `PATCH /api/reservations/:id/status` | Admin Agence | ✅ |
| **Update Status** | `PATCH /api/reservations/:id` | User/Admin | ✅ |
| **List Reservations** | `GET /api/reservations` | User/Admin | ✅ |
| **Get Reservation** | `GET /api/reservations/:id` | User/Admin | ✅ |

---

## 💳 Paiements (Payments)

### Payment Model
| Champ | Type | Description |
|-------|------|-------------|
| `reservation` | ObjectId | Relation vers Reservation |
| `user` | ObjectId | Relation vers User |
| `amount` | Number | Montant du paiement |
| `currency` | String | Devise (default: MAD) |
| `method` | String | `stripe`, `paypal`, `cash` |
| `status` | String | `pending`, `completed`, `failed`, `refunded` |
| `transactionId` | String | ID de transaction |
| `paidAt` | Date | Date du paiement |

### Routes de Paiement
| Fonctionnalité | Route | Accès | Status |
|----------------|-------|-------|--------|
| **Stripe Create** | `POST /api/payments/stripe/create` | User | ✅ |
| **Stripe Confirm** | `POST /api/payments/stripe/confirm` | User | ✅ |
| **PayPal Create** | `POST /api/payments/paypal/create` | User | ⏸️ |
| **PayPal Capture** | `POST /api/payments/paypal/capture` | User | ⏸️ |
| **Cash Create** | `POST /api/payments/cash/create` | User | ✅ |
| **Cash Confirm** | `PATCH /api/payments/cash/:id/confirm` | Agency | ✅ |
| **My Payments** | `GET /api/payments/my-payments` | User | ✅ |
| **All Payments** | `GET /api/payments/all` | Agency | ✅ |
| **By Reservation** | `GET /api/payments/reservation/:id` | User | ✅ |

---

## ⚙️ Logique Métier (Business Logic)

| Fonctionnalité | Description | Status |
|----------------|-------------|--------|
| **Calcul de Prix** | Algorithme basé sur la durée × prix unitaire | ✅ |
| **Prévention Double Booking** | Vérification des chevauchements de dates | ✅ |
| **Validation Réservation** | Seule l'agence propriétaire peut valider | ✅ |

---

## 📊 Dashboard Data

| KPI | Description | Status |
|-----|-------------|--------|
| **Total Réservations** | Nombre par status (pending, accepted, etc.) | ✅ |
| **Total Véhicules** | Nombre dispo vs loués | ✅ |
| **Revenue Estimation** | Somme des réservations acceptées | ✅ |

---

## 🔒 Middlewares

| Middleware | Description |
|------------|-------------|
| **authMiddleware** | Vérification JWT Token |
| **roleMiddleware** | Vérification des rôles utilisateur |

---

## 📦 Technologies Utilisées

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT, Passport.js (Google, Facebook OAuth)
- **Validation:** Express Validator
- **File Upload:** Multer

---

## ✅ État du Projet

> **🚀 Tout est implémenté et fonctionnel !**

| Module | Progress |
|--------|----------|
| Auth & Users | 100% ✅ |
| Agencies | 100% ✅ |
| Vehicles | 100% ✅ |
| Reservations | 100% ✅ |
| Dashboard | 100% ✅ |
| Business Logic | 100% ✅ |

---

*Dernière mise à jour: 2026-02-04*
