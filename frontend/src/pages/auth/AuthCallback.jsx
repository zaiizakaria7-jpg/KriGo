import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserAuth } from "@/lib/user-auth-context";

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useUserAuth();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            // Decode token to get user info
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));

                // Save token and user info
                const user = {
                    id: payload.id,
                    role: payload.role,
                    email: payload.email,
                    nom: payload.nom,
                    prenom: payload.prenom
                };

                localStorage.setItem("krigo_token", token);
                localStorage.setItem("krigo_user", JSON.stringify(user));

                // Update context
                setUser(user);

                // Redirect to home
                navigate("/");
            } catch (error) {
                console.error("Error processing token:", error);
                navigate("/auth/login");
            }
        } else {
            navigate("/auth/login");
        }
    }, [searchParams, navigate, setUser]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="text-lg">Signing you in...</p>
            </div>
        </div>
    );
}
