import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Car, Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { login, isAuthenticated, isSuperAdmin } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // If already logged in, redirect
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate(isSuperAdmin ? "/admin/super" : "/admin/agency");
        }
    }, [isAuthenticated, isSuperAdmin, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const result = login(email, password);
        setLoading(false);

        if (result.success) {
            // Re-read role from context after login
            const isSA = email === "super@krigo.ma";
            navigate(isSA ? "/admin/super" : "/admin/agency");
        } else {
            setError(result.error || "Login failed.");
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Left side - branding panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[hsl(220,20%,8%)] p-12 relative overflow-hidden">
                {/* Decorative gradient orb */}
                <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <img
                            src="/logo.PNG"
                            alt="KriGo Admin"
                            className="h-16 w-auto object-contain rounded-lg"
                        />
                    </div>
                    <p className="text-sm text-[hsl(220,10%,55%)]">Administration Portal</p>
                </div>

                <div className="relative z-10 space-y-6">
                    <h2 className="text-3xl font-bold text-[hsl(0,0%,96%)] leading-tight text-balance">
                        Manage your fleet,<br />
                        agencies, and operations<br />
                        from one place.
                    </h2>
                    <p className="text-[hsl(220,10%,55%)] max-w-md leading-relaxed">
                        Access the admin panel to manage vehicles, track reservations,
                        oversee agency accounts, and monitor platform analytics.
                    </p>
                </div>

                <div className="relative z-10 space-y-3">
                    <div className="flex gap-6">
                        <div>
                            <p className="text-2xl font-bold text-[hsl(0,0%,96%)]">3</p>
                            <p className="text-xs text-[hsl(220,10%,55%)]">Agencies</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[hsl(0,0%,96%)]">25+</p>
                            <p className="text-xs text-[hsl(220,10%,55%)]">Vehicles</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-[hsl(0,0%,96%)]">88</p>
                            <p className="text-xs text-[hsl(220,10%,55%)]">Reservations</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - login form */}
            <div className="flex flex-1 items-center justify-center bg-[hsl(220,20%,6%)] p-6">
                <Card className="w-full max-w-md border-[hsl(220,14%,18%)] bg-[hsl(220,20%,9%)] shadow-2xl">
                    <CardContent className="p-8">
                        {/* Mobile logo */}
                        <div className="flex items-center gap-3 mb-8 lg:hidden justify-center">
                            <img
                                src="/logo.PNG"
                                alt="KriGo Admin"
                                className="h-14 w-auto object-contain rounded-lg"
                            />
                        </div>

                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-[hsl(0,0%,96%)]">Welcome back</h1>
                            <p className="mt-1.5 text-sm text-[hsl(220,10%,55%)]">
                                Sign in to access the admin panel
                            </p>
                        </div>

                        {error && (
                            <Alert variant="destructive" className="mb-6 border-red-900/50 bg-red-950/50 text-red-300">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[hsl(0,0%,80%)] text-sm">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(220,10%,45%)]" />
                                    <Input
                                        type="email"
                                        placeholder="admin@krigo.ma"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)] focus:border-primary focus:ring-primary/20 h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[hsl(0,0%,80%)] text-sm">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(220,10%,45%)]" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 pr-10 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)] focus:border-primary focus:ring-primary/20 h-11"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,45%)] hover:text-[hsl(0,0%,80%)] transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 text-sm font-semibold"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 rounded-lg border border-[hsl(220,14%,18%)] bg-[hsl(220,20%,7%)] p-4">
                            <p className="text-xs font-medium text-[hsl(220,10%,55%)] mb-3">Demo Accounts</p>
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-[hsl(0,0%,80%)]">Super Admin</p>
                                        <p className="text-xs text-[hsl(220,10%,45%)]">super@krigo.ma / admin123</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        type="button"
                                        onClick={() => {
                                            setEmail("super@krigo.ma");
                                            setPassword("admin123");
                                        }}
                                        className="text-xs text-primary hover:text-primary h-7 px-2"
                                    >
                                        Use
                                    </Button>
                                </div>
                                <div className="border-t border-[hsl(220,14%,16%)]" />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-[hsl(0,0%,80%)]">Agency Admin</p>
                                        <p className="text-xs text-[hsl(220,10%,45%)]">casa@krigo.ma / agency123</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        type="button"
                                        onClick={() => {
                                            setEmail("casa@krigo.ma");
                                            setPassword("agency123");
                                        }}
                                        className="text-xs text-primary hover:text-primary h-7 px-2"
                                    >
                                        Use
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
