import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from "./api";

const UserAuthContext = createContext();

export function UserAuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem('krigo_user');
            const token = localStorage.getItem('krigo_token');

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            if (token) {
                try {
                    const res = await fetch('/api/users/profile', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data.user);
                        localStorage.setItem('krigo_user', JSON.stringify(data.user));
                    }
                } catch (error) {
                    console.error("Fetch profile error:", error);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);



    const login = async (email, password) => {
        try {
            const data = await authApi.login({ email, password });

            if (data.requires2FA) {
                return { requires2FA: true, userId: data.userId };
            }

            if (data.token) {
                // Store user and token
                setUser(data.user);
                localStorage.setItem("krigo_user", JSON.stringify(data.user));
                // Store token separately or within user if preferred
                localStorage.setItem("krigo_token", data.token);
                return { success: true };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: error.message };
        }
        return { success: false, error: "Login failed" };
    };

    const verifyTwoFactor = async (userId, token) => {
        try {
            const data = await authApi.verify2FA({ userId, token });
            if (data.token) {
                setUser(data.user);
                localStorage.setItem("krigo_user", JSON.stringify(data.user));
                localStorage.setItem("krigo_token", data.token);
                return { success: true };
            }
        } catch (error) {
            console.error("2FA error:", error);
            return { success: false, error: error.message };
        }
        return { success: false, error: "Verification failed" };
    };

    const register = async (email, password, nom, prenom) => {
        try {
            const res = await authApi.register({
                email,
                password,
                nom,
                prenom
            });

            if (res.user || res.token) {
                // Registration successful
                return { success: true, data: res };
            }
        } catch (error) {
            throw error; // Let the caller handle the error
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('krigo_user');
        localStorage.removeItem('krigo_token');
    };

    const refreshUser = (userData) => {
        setUser(userData);
        localStorage.setItem("krigo_user", JSON.stringify(userData));
    };

    return (
        <UserAuthContext.Provider value={{ user, login, verifyTwoFactor, register, logout, loading, refreshUser }}>
            {children}
        </UserAuthContext.Provider>
    );
}

export function useUserAuth() {
    return useContext(UserAuthContext);
}
