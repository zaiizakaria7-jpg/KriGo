import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "@/lib/user-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    AlertCircle,
    Loader2,
    Eye,
    EyeOff,
    ChevronLeft,
    Lock,
    Mail,
    ArrowRight,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
    const navigate = useNavigate();
    const { login, verifyTwoFactor, user } = useUserAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const [twoFactorCode, setTwoFactorCode] = useState("");
    const [userId, setUserId] = useState(null);

    // If already logged in, redirect
    React.useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.requires2FA) {
                setUserId(result.userId);
                setShow2FA(true);
                setLoading(false);
                return;
            }

            if (result.success) {
                handleRedirect();
            } else {
                setError(result.error || "Login failed.");
            }
        } catch (err) {
            setError(err.message || "Login failed.");
        } finally {
            if (!show2FA) setLoading(false);
        }
    }

    async function handle2FASubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const result = await verifyTwoFactor(userId, twoFactorCode);
            if (result.success) {
                handleRedirect();
            } else {
                setError(result.error || "Invalid 2FA code");
                setLoading(false);
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    function handleRedirect() {
        const storedUser = JSON.parse(localStorage.getItem("krigo_user") || "{}");
        // const userRole = storedUser.role; // Sometimes this might not update in context immediately, better to rely on storage or result if passed.
        // Assuming context update is async, rely on what we just got
        // But verifyTwoFactor returns success, context updates.
        // Let's use storedUser from localStorage which IS updated in context functions.
        const userRole = storedUser.role;

        if (userRole === "admin" || userRole === "super" || userRole?.startsWith('admin')) {
            if (userRole === "super" || userRole === "admin_super") {
                navigate("/admin/super");
            } else {
                navigate("/admin/agency");
            }
        } else {
            navigate("/dashboard");
        }
    }

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
            {/* Left Side: Visual Branding (Hidden on mobile) */}
            <div className="relative hidden w-full lg:flex lg:w-1/2 xl:w-3/5 bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80"
                        alt="KriGo Premium Experience"
                        className="h-full w-full object-cover opacity-40 mix-blend-luminosity grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/40 to-primary/20" />
                </div>

                <div className="relative z-10 flex h-full w-full flex-col p-12">
                    <Link to="/" className="flex items-center gap-2 group transition-all">
                        <img src="/logo.PNG" className="h-10 w-auto object-contain transition-transform group-hover:scale-105" alt="KriGo" />
                    </Link>

                    <div className="mt-auto max-w-lg">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 backdrop-blur-md mb-6">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">Premium Fleet 2024</span>
                        </div>
                        <h2 className="text-5xl font-black text-white leading-[1.1] font-heading tracking-tight mb-6">
                            Experience the road <br />
                            <span className="text-primary">Without limits.</span>
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed mb-8 opacity-80">
                            Access Morocco's most exclusive collection of vehicles.
                            Your journey starts with a single sign-in.
                        </p>

                        <div className="grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
                            <div>
                                <p className="text-2xl font-bold text-white tracking-tight">25+</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Cars</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white tracking-tight">12/7</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Active</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white tracking-tight">100%</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Secure</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-[120px] animate-pulse" />
                <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[100px]" />
            </div>

            {/* Right Side: Login Form */}
            <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2 xl:w-2/5 animate-in fade-in duration-700">
                <div className="w-full max-w-sm">
                    {/* Mobile Branding */}
                    <div className="mb-8 flex flex-col items-center lg:hidden">
                        <img src="/logo.PNG" className="h-12 w-auto object-contain mb-4" alt="KriGo" />
                    </div>

                    <div className="flex flex-col gap-2 mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading">Sign in</h2>
                        <p className="text-muted-foreground">Welcome back to the KriGo network.</p>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-6 rounded-2xl border-red-500/10 bg-red-500/5 text-red-500 animate-in slide-in-from-top-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="font-medium">{error}</AlertDescription>
                        </Alert>
                    )}

                    {show2FA ? (
                        <form onSubmit={handle2FASubmit} className="space-y-6">
                            <div className="space-y-2 group transition-all">
                                <Label htmlFor="code" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 ml-1">
                                    <Lock className="h-3 w-3 text-primary" /> Two-Factor Authentication
                                </Label>
                                <div className="text-sm text-muted-foreground mb-4">
                                    Enter the 6-digit code from your authenticator app.
                                </div>
                                <div className="relative">
                                    <Input
                                        id="code"
                                        type="text"
                                        placeholder="000000"
                                        value={twoFactorCode}
                                        onChange={(e) => setTwoFactorCode(e.target.value)}
                                        required
                                        maxLength={6}
                                        className="h-12 px-4 rounded-xl border-white/10 bg-muted/30 focus-visible:ring-primary/40 focus:bg-background transition-all text-center text-lg tracking-[0.5em]"
                                    />
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-focus-within:w-full transition-all duration-300 rounded-full" />
                                </div>
                            </div>

                            <Button type="submit" className="h-12 w-full rounded-xl bg-primary text-base font-bold shadow-lg shadow-primary/20 group overflow-hidden" disabled={loading || twoFactorCode.length < 6}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Verify Code <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                )}
                            </Button>

                            <Button variant="ghost" type="button" onClick={() => setShow2FA(false)} className="w-full text-muted-foreground hover:text-foreground">
                                Back to Login
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 group transition-all">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 ml-1">
                                    <Mail className="h-3 w-3 text-primary" /> Email Address
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-12 px-4 rounded-xl border-white/10 bg-muted/30 focus-visible:ring-primary/40 focus:bg-background transition-all"
                                    />
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-focus-within:w-full transition-all duration-300 rounded-full" />
                                </div>
                            </div>

                            <div className="space-y-2 group transition-all">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Lock className="h-3 w-3 text-primary" /> Password
                                    </Label>
                                    <Link
                                        to="#"
                                        className="text-xs font-bold text-primary/80 hover:text-primary transition-colors"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-12 px-4 rounded-xl border-white/10 bg-muted/30 focus-visible:ring-primary/40 focus:bg-background transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-focus-within:w-full transition-all duration-300 rounded-full" />
                                </div>
                            </div>

                            <Button type="submit" className="h-12 w-full rounded-xl bg-primary text-base font-bold shadow-lg shadow-primary/20 group overflow-hidden" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign In <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                )}
                            </Button>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/5" />
                                </div>
                                <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                                    <span className="bg-background px-4 text-muted-foreground">
                                        Trusted Identity
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="h-11 rounded-xl border-white/10 bg-muted/10 hover:bg-muted/30 transition-all font-bold gap-2"
                                    onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
                                >
                                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                                    Google
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="h-11 rounded-xl border-white/10 bg-muted/10 hover:bg-muted/30 transition-all font-bold gap-2"
                                    onClick={() => window.location.href = "http://localhost:5000/api/auth/facebook"}
                                >
                                    <svg className="h-4 w-4 text-[#1877F2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path></svg>
                                    Facebook
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="mt-8 text-center text-sm">
                        <span className="text-muted-foreground font-medium italic">New to KriGo? </span>
                        <Link to="/register" className="font-bold text-primary hover:text-primary/80 transition-all underline underline-offset-4 decoration-primary/30">
                            Create an account
                        </Link>
                    </div>
                </div>

                <footer className="mt-auto pt-10 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        &copy; 2024 KRIGO SYSTEMS. ALL RIGHTS PROTECTED.
                    </p>
                </footer>
            </div>
        </div>
    );
}
