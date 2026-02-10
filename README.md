# KriGo 🚗 - Premium Vehicle Rental Platform

KriGo is a full-stack, state-of-the-art vehicle rental management system designed for the Moroccan market. It provides a seamless experience for users to rent cars, bikes, and electric scooters while offering robust administrative tools for agencies and platform owners.

---

## ✨ Key Features

### 👤 For Users (Renters)
- **Modern Dashboard**: Real-time overview of active bookings, payments, and account status.
- **Premium Checkout**: Secure booking flow with date selection and instant price calculation.
- **Multiple Payment Gateways**: Choice between **Stripe** (Credit Card) and **PayPal**.
- **Unified Profile Management**: 
    - Personal details management.
    - Security settings including **Two-Factor Authentication (2FA)**.
    - Profile picture uploads.
    - Account deletion (Danger Zone).
- **OAuth Integration**: Instant sign-in via **Google** and **Facebook**.

### 🏢 For Agency Managers
- **Agency Analytics**: Track revenue, active rentals, and fleet performance.
- **Fleet Management**: Full CRUD for vehicles (Add, Edit, Remove, Manage availability).
- **Reservation Control**: Accept, refuse, or manage customer bookings in real-time.
- **Document Verification**: Track user identity status for secure rentals.

### 👑 For Super Admins
- **Global Overview**: Platform-wide stats across all agencies and users.
- **Agency Onboarding**: Create and manage participating rental agencies.
- **User Management**: Monitor user activity, roles (Admin/User), and account statuses.
- **Activity Logs**: Track system-wide events and critical changes.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 (Vite-powered for high performance).
- **Styling**: Tailwind CSS with a "Softer" Premium UI theme (optimized for visual comfort).
- **UI Components**: Shadcn UI (Radix-based, highly accessible and customizable).
- **State & Context**: Custom UseAuth hooks for session management.
- **Animations**: Framer Motion & Animate.css for smooth transitions.

### Backend
- **Runtime**: Node.js & Express.
- **Database**: MongoDB (Mongoose ODM).
- **Security**: 
    - **JWT** (JSON Web Tokens) for session security.
    - **Passport.js** for OAuth strategies (Google/Facebook).
    - **Bcrypt.js** for secure password hashing.
    - **Speakeasy** for TOTP-based 2FA.
- **Payments**: Stripe Node SDK & PayPal Checkout SDK.

---

## 🎨 Design Aesthetics
- **Premium UI**: Custom "Softer" Light Mode to prevent eye strain and maintain professional elegance.
- **Glassmorphism**: Subtle backdrop-blur effects on navigation and cards.
- **Micro-animations**: Interactive hover effects and slide-in transitions.
- **Responsive Architecture**: Fully optimized for mobile, tablet, and desktop viewing.

---

## ⚙️ Installation & Development

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Stripe & PayPal Developer credentials

### 2. Setup
```bash
# Clone the repository
git clone https://github.com/zaiizakaria7-jpg/KriGo.git
cd KriGo

# Install dependencies (Root, Frontend, Backend)
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 3. Environment Variables (`.env`)
Create a `.env` in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
STRIPE_SECRET_KEY=...
PAYPAL_CLIENT_ID=...
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

### 4. Running the App
```bash
# Start Backend
cd backend
npm run dev

# Start Frontend (Separate terminal)
cd frontend
npm run dev
```

---

## 📂 Project Structure
```text
KriGo/
├── backend/            # Express API, Mongoose Models, Controllers
│   ├── src/
│   │   ├── config/     # Passport & DB configs
│   │   ├── controllers/# Business logic
│   │   ├── models/     # Database schemas
│   │   └── routes/     # API endpoints
├── frontend/           # Vite + React 18 Application
│   ├── src/
│   │   ├── components/ # Atomic UI & Landing elements
│   │   ├── lib/        # Auth context & API helpers
│   │   ├── pages/      # Route-based views (Dashboard, Auth, etc.)
│   │   └── layouts/    # Shell structures
└── .env                # Global configuration
```

---
&copy; 2024 KriGo Systems. All rights reserved.
