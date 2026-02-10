import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "@/lib/user-auth-context";

export default function AdminRedirect() {
    const navigate = useNavigate();
    const { user, loading } = useUserAuth();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            // Not logged in → redirect to login
            navigate("/login", { replace: true });
        } else {
            // Logged in → redirect based on role
            if (user.role === "super" || user.role === "admin_super") {
                navigate("/admin/super", { replace: true });
            } else if (user.role === "admin" || user.role === "admin_agency") {
                navigate("/admin/agency", { replace: true });
            } else {
                // Regular user trying to access admin → redirect to user dashboard
                navigate("/dashboard", { replace: true });
            }
        }
    }, [user, loading, navigate]);

    return (
        <div className="flex h-screen items-center justify-center bg-[hsl(220,20%,6%)]">
            <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm text-[hsl(220,10%,50%)]">Redirecting...</p>
            </div>
        </div>
    );
}
