export const API_URL = "/api";

export async function apiRequest(endpoint: string, method: string = "GET", data?: any) {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    const token = localStorage.getItem("krigo_token") || sessionStorage.getItem("krigo_admin_auth");
    if (token) {
        // Handle potential JSON object in storage if it's the admin one
        try {
            const parsed = JSON.parse(token);
            if (parsed && parsed.token) {
                headers["Authorization"] = `Bearer ${parsed.token}`;
            } else if (typeof token === 'string' && !token.startsWith('{')) {
                headers["Authorization"] = `Bearer ${token}`;
            }
        } catch (e) {
            if (typeof token === 'string') {
                headers["Authorization"] = `Bearer ${token}`;
            }
        }
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || "Something went wrong");
        }

        return responseData;
    } catch (error) {
        throw error;
    }
}

export const authApi = {
    login: (data: any) => apiRequest("/auth/login", "POST", data),
    register: (data: any) => apiRequest("/auth/register", "POST", data),
    me: () => apiRequest("/auth/me"), // If you add this endpoint later
    verify2FA: (data: any) => apiRequest("/auth/verify-2fa", "POST", data),
    // Security
    changePassword: (data: any) => apiRequest("/users/change-password", "PUT", data),
    generate2FA: () => apiRequest("/users/2fa/generate", "POST"),
    enable2FA: (data: any) => apiRequest("/users/2fa/enable", "POST", data),
    disable2FA: (data: any) => apiRequest("/users/2fa/disable", "POST", data),
    deleteAccount: (data: any) => apiRequest("/users/account", "DELETE", data),
};

export const vehicleApi = {
    getAll: (params?: any) => {
        const queryString = params ? '?' + new URLSearchParams(params).toString() : "";
        return apiRequest(`/vehicles${queryString}`);
    },
    getById: (id: string) => apiRequest(`/vehicles/${id}`),
};
