import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "@/lib/user-auth-context";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children, requiredRole }) {
  const navigate = useNavigate();
  const { user, loading } = useUserAuth();
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (loading) return;

    if (!user) {
      // Not logged in → redirect to login
      navigate("/login");
      return;
    }

    // Check if user has required role
    if (requiredRole) {
      const isSuper = user.role === "super" || user.role === "admin_super";
      const isAdmin = user.role === "admin" || user.role === "admin_agency";

      if (requiredRole === "admin_agency" && !isAdmin && !isSuper) {
        // User is not agency admin AND not super admin
        navigate("/dashboard");
        return;
      }

      if (requiredRole === "admin_super" && !isSuper) {
        // User is not super admin
        if (isAdmin) {
          navigate("/admin/agency");
        } else {
          navigate("/dashboard");
        }
        return;
      }
    }

    setChecked(true);
  }, [user, loading, requiredRole, navigate]);

  if (!checked || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[hsl(220,20%,6%)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-[hsl(220,10%,50%)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[hsl(220,20%,6%)]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
