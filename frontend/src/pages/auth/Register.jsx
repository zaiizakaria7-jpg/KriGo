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
    User,
    Mail,
    Lock,
    ArrowRight,
    ShieldCheck,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Register() {
    const navigate = useNavigate();
    const { register, user } = useUserAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const nameParts = name.trim().split(" ");
            const prenom = nameParts[0] || "";
            const nom = nameParts.slice(1).join(" ") || nameParts[0];

            const response = await register(email, password, nom, prenom);

            if (response) {
                toast.success("Account created successfully! Please sign in.");
                navigate("/login");
            }
        } catch (err) {
            setError(err.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
            {/* Left Side: Visual Branding (Hidden on mobile) */}
            <div className="relative hidden w-full lg:flex lg:w-1/2 xl:w-3/5 bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80"
                        alt="KriGo Premium Fleet"
                        className="h-full w-full object-cover opacity-40 mix-blend-luminosity grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/40 to-primary/20" />
                </div>

                <div className="relative z-10 flex h-full w-full flex-col p-12">


                    <div className="mt-auto max-w-lg">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 backdrop-blur-md mb-6">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">Join the Elite</span>
                        </div>
                        <h2 className="text-5xl font-black text-white leading-[1.1] font-heading tracking-tight mb-6">
                            Start your <br />
                            <span className="text-primary">Masterpiece journey.</span>
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed mb-8 opacity-80">
                            Create your KriGo account to unlock exclusive access to our premium vehicle fleet and customized rental experiences.
                        </p>

                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-950 bg-slate-800 overflow-hidden">
                                        <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${i * 123}&backgroundColor=0084ff,039be5,0288d1&backgroundType=gradientLinear&chars=1`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-slate-400">
                                <span className="text-white font-bold">1,000+</span> drivers already joined
                            </p>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/20 blur-[120px]" />
            </div>

            {/* Right Side: Register Form */}
            <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2 xl:w-2/5 animate-in fade-in duration-700">
                <div className="w-full max-w-sm">
                    {/* Mobile Branding */}


                    <div className="flex flex-col gap-2 mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground font-heading">Create Account</h2>
                        <p className="text-muted-foreground">Join the most exclusive rental network.</p>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-6 rounded-2xl border-red-500/10 bg-red-500/5 text-red-500 animate-in slide-in-from-top-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="font-medium">{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2 group transition-all">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 ml-1">
                                <User className="h-3 w-3 text-primary" /> Full Name
                            </Label>
                            <div className="relative">
                                <Input
                                    id="name"
                                    placeholder="e.g. Karim Bennani"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="h-11 px-4 rounded-xl border-white/10 bg-muted/30 focus-visible:ring-primary/40 focus:bg-background transition-all"
                                />
                                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-focus-within:w-full transition-all duration-300 rounded-full" />
                            </div>
                        </div>

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
                                    className="h-11 px-4 rounded-xl border-white/10 bg-muted/30 focus-visible:ring-primary/40 focus:bg-background transition-all"
                                />
                                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-focus-within:w-full transition-all duration-300 rounded-full" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 group transition-all">
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 ml-1">
                                    <Lock className="h-3 w-3 text-primary" /> Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 px-4 rounded-xl border-white/10 bg-muted/30 focus-visible:ring-primary/40 focus:bg-background transition-all text-sm"
                                    />
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-focus-within:w-full transition-all duration-300 rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-2 group transition-all">
                                <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 ml-1">
                                    Confirm
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="h-11 px-4 rounded-xl border-white/10 bg-muted/30 focus-visible:ring-primary/40 focus:bg-background transition-all text-sm"
                                    />
                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary group-focus-within:w-full transition-all duration-300 rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 py-2">
                            <div className="h-4 w-4 rounded border border-primary/40 flex items-center justify-center cursor-pointer">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <span className="text-[10px] text-muted-foreground font-medium">I agree to the <span className="text-foreground underline underline-offset-2">Terms of Service</span> and <span className="text-foreground underline underline-offset-2">Privacy Policy</span>.</span>
                        </div>

                        <Button type="submit" className="h-12 w-full rounded-xl bg-primary text-base font-bold shadow-lg shadow-primary/20 group overflow-hidden mt-4" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign Up <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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

                    <div className="mt-8 text-center text-sm">
                        <span className="text-muted-foreground font-medium italic">Already have an account? </span>
                        <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-all underline underline-offset-4 decoration-primary/30">
                            Sign In
                        </Link>
                    </div>
                </div>

                <footer className="mt-auto pt-10 text-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                        &copy; 2024 KRIGO SYSTEMS. JOIN THE FUTURE.
                    </p>
                </footer>
            </div>
        </div>
    );
}
