import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Vehicles from './pages/vehicles/Vehicles';
import VehicleDetail from './pages/vehicles/VehicleDetail';
import Checkout from './pages/checkout/Checkout';

import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/dashboard/Profile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AuthCallback from './pages/auth/AuthCallback';

// Admin Pages
import AdminRedirect from './pages/admin/AdminRedirect';
import AdminLogin from './pages/admin/login/AdminLogin';

// Admin Agency Pages
import AgencyDashboard from './pages/admin/agency/AgencyDashboard';
import AgencyAnalytics from './pages/admin/agency/analytics/AgencyAnalytics';
import AgencyReservations from './pages/admin/agency/reservations/AgencyReservations';
import AgencyVehicles from './pages/admin/agency/vehicles/AgencyVehicles';

// Admin Super Pages
import SuperDashboard from './pages/admin/super/SuperDashboard';
import SuperActivity from './pages/admin/super/activity/SuperActivity';
import SuperAgencies from './pages/admin/super/agencies/SuperAgencies';
import SuperAnalytics from './pages/admin/super/analytics/SuperAnalytics';
import SuperReservations from './pages/admin/super/reservations/SuperReservations';
import SuperSettings from './pages/admin/super/settings/SuperSettings';
import SuperUsers from './pages/admin/super/users/SuperUsers';
import SuperVehicles from './pages/admin/super/vehicles/SuperVehicles';

function App() {
    return (
        <MainLayout>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/vehicles/:id" element={<VehicleDetail />} />
                <Route path="/checkout" element={<Checkout />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* Protected User Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRedirect />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Admin Agency Routes */}
                <Route path="/admin/agency" element={<AgencyDashboard />} />
                <Route path="/admin/agency/analytics" element={<AgencyAnalytics />} />
                <Route path="/admin/agency/reservations" element={<AgencyReservations />} />
                <Route path="/admin/agency/vehicles" element={<AgencyVehicles />} />

                {/* Admin Super Routes */}
                <Route path="/admin/super" element={<SuperDashboard />} />
                <Route path="/admin/super/activity" element={<SuperActivity />} />
                <Route path="/admin/super/agencies" element={<SuperAgencies />} />
                <Route path="/admin/super/analytics" element={<SuperAnalytics />} />
                <Route path="/admin/super/reservations" element={<SuperReservations />} />
                <Route path="/admin/super/settings" element={<SuperSettings />} />
                <Route path="/admin/super/users" element={<SuperUsers />} />
                <Route path="/admin/super/vehicles" element={<SuperVehicles />} />
            </Routes>
        </MainLayout>
    );
}

export default App;
