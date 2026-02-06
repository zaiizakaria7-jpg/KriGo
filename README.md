# KriGO Backend 🚗

Welcome to the backend API for **KriGO**, a vehicle rental platform management system.

## 🚀 Features Implemented

### 1. Authentication & Security 🔐
- **JWT Authentication**: Secure stateless authentication using JSON Web Tokens.
- **Passport Strategies**:
  - **Google OAuth**: Login with Google account.
  - **Local Login**: Standard email/password login.
- **Role-Based Access Control (RBAC)**: Defined roles (`user` by default, extensible).

### 2. Agency Management 🏢
- Manage rental agencies.
- Link users to agencies.

### 3. Vehicle Management 🚙
- Manage vehicle inventory (CRUD operations).
- Associate vehicles with agencies.

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: Passport.js, JWT
- **Environment**: Dotenv

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/zaiizakaria7-jpg/KriGo.git
   cd KriGo
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory and add:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run the Server**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Auth
- `POST /auth/login` - Login with credentials
- `GET /auth/google` - Login with Google

### Other
- Agency & Vehicle routes are available under their respective paths.
