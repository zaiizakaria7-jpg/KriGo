import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useState, Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    CreditCard, Banknote, ArrowLeft, ShieldCheck, Lock, CheckCircle2,
    Fingerprint, Phone, User, Mail, Sparkles, Map, UserPlus, Shield
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useUserAuth } from "@/lib/user-auth-context";
import { cn } from "@/lib/utils";

function CheckoutContent() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useUserAuth();

    const vehicleId = searchParams.get("vehicle");
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");
    const baseTotal = parseFloat(searchParams.get("total") || "0");

    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("stripe");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    // Personal & Identity Data (Auto-filled from user)
    const [cin, setCin] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // Additional Options
    const [options, setOptions] = useState({
        gps: false,
        extraDriver: false,
        insurance: "none"
    });

    // Option Prices
    const OPTION_PRICES = {
        gps: 50, // per booking
        extraDriver: 100, // per booking
        premiumInsurance: 150 // per day
    };

    // Card details state
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCVC, setCardCVC] = useState("");
    const [cardName, setCardName] = useState("");

    // Auto-fill from user context
    useEffect(() => {
        if (user) {
            setCin(user.CIN || "");
            setPhoneNumber(user.phone || "");
            setCardName(`${user.prenom} ${user.nom}`.trim());
        }
    }, [user]);

    // Calculate dynamic total
    const getDays = () => {
        if (!fromDate || !toDate) return 1;
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const diff = Math.round(Math.abs((end - start) / (24 * 60 * 60 * 1000)));
        return diff + 1;
    };

    const days = getDays();
    const extraTotal = (options.gps ? OPTION_PRICES.gps : 0) +
        (options.extraDriver ? OPTION_PRICES.extraDriver : 0) +
        (options.insurance === "premium" ? OPTION_PRICES.premiumInsurance * days : 0);
    const total = baseTotal + extraTotal;

    // Fetch vehicle from API
    useEffect(() => {
        if (!vehicleId) {
            setLoading(false);
            return;
        }

        async function fetchVehicle() {
            try {
                const res = await fetch(`/api/vehicles/${vehicleId}`);
                if (res.ok) {
                    const data = await res.json();
                    setVehicle(data);
                }
            } catch (err) {
                console.error("Failed to fetch vehicle", err);
            } finally {
                setLoading(false);
            }
        }
        fetchVehicle();
    }, [vehicleId]);

    async function handlePayment() {
        if (!cin || !phoneNumber) {
            toast.error("Please provide your CIN and Phone Number");
            return;
        }

        setProcessing(true);

        if (paymentMethod === "stripe") {
            if (!cardNumber || !cardExpiry || !cardCVC || !cardName) {
                toast.error("Please fill in all card details");
                setProcessing(false);
                return;
            }
        }

        try {
            const token = localStorage.getItem("krigo_token");
            if (!token) {
                toast.error("Please login to complete your booking");
                navigate("/login");
                return;
            }

            const res = await fetch("/api/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    vehicleId: vehicleId,
                    startDate: fromDate,
                    endDate: toDate,
                    cin: cin,
                    phone: phoneNumber,
                    options: options,
                    totalPrice: total // Sending final calculated total
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                toast.success("Reservation Created! Luxury awaits you.");
            } else {
                toast.error(data.message || "Checkout failed");
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Service temporarily unavailable. Please try again.");
        } finally {
            setProcessing(false);
        }
    }

    if (!vehicleId || !fromDate || !toDate) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                    <Lock className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Checkout Expired</h2>
                <p className="mt-2 text-muted-foreground max-w-sm">The booking session has timed out or is missing critical data.</p>
                <Button className="mt-8 rounded-xl px-8" asChild>
                    <Link to="/vehicles">Return to Fleet</Link>
                </Button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
                </div>
                <p className="mt-6 font-bold text-lg tracking-tight uppercase opacity-60">Preparing your experience...</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in duration-700">
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary shadow-2xl shadow-primary/40 rotate-12">
                    <CheckCircle2 className="h-12 w-12 text-white -rotate-12" />
                </div>
                <h2 className="text-4xl font-black tracking-tighter text-foreground font-heading">RESERVATION CONFIRMED</h2>
                <p className="mt-4 max-w-lg text-lg text-muted-foreground leading-relaxed">
                    Excellence awaits. Your <span className="text-foreground font-bold">{vehicle.brand} {vehicle.model}</span> has been successfully reserved for your journey.
                </p>

                <Card className="mt-10 w-full max-w-md bg-muted/30 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Pick-up Date</span>
                            <span className="font-bold">{format(new Date(fromDate), "MMMM d, yyyy")}</span>
                        </div>
                        <Separator className="bg-white/5" />
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Return Date</span>
                            <span className="font-bold">{format(new Date(toDate), "MMMM d, yyyy")}</span>
                        </div>
                    </CardContent>
                </Card>

                <div className="mt-10 flex flex-wrap gap-4 justify-center">
                    <Button size="lg" className="rounded-2xl px-10 h-14 font-bold shadow-xl shadow-primary/20" asChild>
                        <Link to="/dashboard">Go to Dashboard</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-2xl px-10 h-14 font-bold border-white/10" asChild>
                        <Link to="/vehicles">Explore More</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    return (
        <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 rounded-xl text-muted-foreground hover:text-primary">
                        <Link to={`/vehicles/${vehicle._id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return to Vehicle Selection
                        </Link>
                    </Button>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground font-heading">
                        SECURE YOUR <span className="text-primary italic">DRIVE.</span>
                    </h1>
                </div>
                <div className="hidden lg:flex items-center gap-4 py-2 px-4 rounded-2xl bg-muted/50 border border-white/5">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">End-to-End Encryption Active</span>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                {/* Main Form Area */}
                <div className="lg:col-span-8 space-y-8 animate-in slide-in-from-left duration-700">

                    {/* Identity & Contact Section */}
                    <Card className="rounded-3xl border-white/5 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                        <div className="h-1.5 w-full bg-primary/20" />
                        <CardHeader className="pt-8 px-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Fingerprint className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold tracking-tight">Renter Details</CardTitle>
                                    <CardDescription>Verified identification for your security.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            {/* Auto-filled Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-muted/30 border border-white/5">
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] ml-1">Account Holder</Label>
                                    <div className="flex items-center gap-2 text-sm font-bold ml-1">
                                        <User className="h-3.5 w-3.5 text-primary" />
                                        {user?.prenom} {user?.nom}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] ml-1">Verified Email</Label>
                                    <div className="flex items-center gap-2 text-sm font-bold ml-1">
                                        <Mail className="h-3.5 w-3.5 text-primary" />
                                        {user?.email}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 group">
                                    <Label htmlFor="cin" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">CIN / Passport Number</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Fingerprint className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <Input
                                            id="cin"
                                            placeholder="e.g. AB123456"
                                            className="h-14 pl-11 rounded-2xl border-white/10 bg-muted/40 focus:ring-primary/30 focus:bg-background transition-all"
                                            value={cin}
                                            onChange={(e) => setCin(e.target.value.toUpperCase())}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 group">
                                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Active Phone Number</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <Input
                                            id="phone"
                                            placeholder="+212 6..."
                                            className="h-14 pl-11 rounded-2xl border-white/10 bg-muted/40 focus:ring-primary/30 focus:bg-background transition-all"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Options */}
                    <Card className="rounded-3xl border-white/5 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                        <CardHeader className="pt-8 px-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold tracking-tight">Luxury Extras</CardTitle>
                                    <CardDescription>Tailor your journey to perfection.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-muted/20 hover:bg-muted/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Map className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold">GPS Navigation System</p>
                                        <p className="text-xs text-muted-foreground">High-precision routing. (+{OPTION_PRICES.gps} MAD)</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={options.gps}
                                    onCheckedChange={(val) => setOptions({ ...options, gps: val })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-muted/20 hover:bg-muted/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                        <UserPlus className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Additional Driver</p>
                                        <p className="text-xs text-muted-foreground">Share the driving experience. (+{OPTION_PRICES.extraDriver} MAD)</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={options.extraDriver}
                                    onCheckedChange={(val) => setOptions({ ...options, extraDriver: val })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-muted/20 hover:bg-muted/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold">Insurance Coverage</p>
                                        <p className="text-xs text-muted-foreground">{options.insurance === "premium" ? "Complete protection & zero deductible." : "Standard rental protection."}</p>
                                    </div>
                                </div>
                                <Select
                                    value={options.insurance}
                                    onValueChange={(val) => setOptions({ ...options, insurance: val })}
                                >
                                    <SelectTrigger className="w-40 rounded-xl border-white/10 font-bold bg-muted/20">
                                        <SelectValue placeholder="Standard" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-white/10 shadow-2xl">
                                        <SelectItem value="none">Standard</SelectItem>
                                        <SelectItem value="premium">Premium (+{OPTION_PRICES.premiumInsurance} MAD/d)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Section */}
                    <Card className="rounded-3xl border-white/5 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                        <CardHeader className="pt-8 px-8">
                            <CardTitle className="text-2xl font-bold tracking-tight">Payment Selection</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-8">
                                <TabsList className="grid w-full grid-cols-3 h-14 p-1.5 rounded-2xl bg-muted/50 border border-white/5">
                                    <TabsTrigger value="stripe" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg">
                                        <CreditCard className="mr-2 h-4 w-4" /> Card
                                    </TabsTrigger>
                                    <TabsTrigger value="paypal" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg">
                                        PayPal
                                    </TabsTrigger>
                                    <TabsTrigger value="cash" className="rounded-xl font-bold data-[state=active]:bg-background data-[state=active]:shadow-lg">
                                        <Banknote className="mr-2 h-4 w-4" /> After Pickup
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="stripe" className="space-y-6 animate-in fade-in duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2 space-y-2 group">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Card Number</Label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input
                                                    placeholder="0000 0000 0000 0000"
                                                    className="h-14 pl-12 rounded-2xl border-white/10 bg-muted/20"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(e.target.value)}
                                                    maxLength={19}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Exp. Date</Label>
                                            <Input
                                                placeholder="MM / YY"
                                                className="h-14 rounded-2xl border-white/10 bg-muted/20"
                                                value={cardExpiry}
                                                onChange={(e) => setCardExpiry(e.target.value)}
                                                maxLength={5}
                                            />
                                        </div>
                                        <div className="space-y-2 group">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">CVC/CVV Code</Label>
                                            <Input
                                                placeholder="123"
                                                className="h-14 rounded-2xl border-white/10 bg-muted/20"
                                                value={cardCVC}
                                                onChange={(e) => setCardCVC(e.target.value)}
                                                maxLength={4}
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2 group">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cardholder Entity</Label>
                                            <Input
                                                placeholder="Full legal name"
                                                className="h-14 rounded-2xl border-white/10 bg-muted/20"
                                                value={cardName}
                                                onChange={(e) => setCardName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="paypal" className="animate-in fade-in duration-500">
                                    <div className="rounded-2xl border-2 border-dashed border-white/5 bg-muted/20 p-12 text-center">
                                        <p className="text-sm text-muted-foreground font-medium italic">
                                            You will be redirected to PayPal's secure portal upon confirmation.
                                        </p>
                                    </div>
                                </TabsContent>

                                <TabsContent value="cash" className="animate-in fade-in duration-500">
                                    <div className="rounded-2xl border-2 border-dashed border-white/5 bg-muted/20 p-12 text-center">
                                        <Banknote className="mx-auto mb-4 h-10 w-10 text-primary opacity-60" />
                                        <p className="text-sm text-muted-foreground font-medium">
                                            Confirm reservation now. Final payment occurs at the <span className="text-foreground font-bold">KriGo Agency</span> office.
                                        </p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* Sticky Order Summary */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 animate-in slide-in-from-right duration-700">
                    <Card className="rounded-3xl border-primary/20 bg-background/50 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-40 w-40 bg-primary/10 blur-[80px] -z-10 group-hover:bg-primary/20 transition-all duration-700" />

                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold tracking-tight opacity-70">CONFIRMATION SUMMARY</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="flex gap-4">
                                <div className="h-24 w-32 shrink-0 overflow-hidden rounded-2xl border border-white/5 shadow-inner bg-muted">
                                    <img
                                        src={vehicle.image || "/placeholder.svg"}
                                        alt={`${vehicle.brand} ${vehicle.model}`}
                                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex flex-col justify-center gap-1.5">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">Selected Vehicle</p>
                                    <h3 className="font-bold text-lg leading-none">
                                        {vehicle.brand} {vehicle.model}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Fingerprint className="h-3 w-3" />
                                        {vehicle.category} • {vehicle.transmission}
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="space-y-4">
                                <div className="flex justify-between items-center group/item">
                                    <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">Duration</span>
                                    <span className="text-sm font-bold">{days} {days === 1 ? 'Day' : 'Days'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-2xl bg-muted/30 border border-white/5">
                                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">Pick-up</p>
                                        <p className="text-xs font-bold">{format(from, "MMM d")}</p>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-muted/30 border border-white/5">
                                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">Return</p>
                                        <p className="text-xs font-bold">{format(to, "MMM d")}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Daily Rate ({vehicle.price_per_day} × {days})</span>
                                    <span className="font-bold">{baseTotal} MAD</span>
                                </div>

                                {extraTotal > 0 && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2">
                                        <Separator className="bg-white/5" />
                                        <p className="text-[10px] font-black uppercase text-orange-500 tracking-widest">Added Services</p>
                                        {options.gps && (
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Navigation System</span>
                                                <span className="font-bold text-orange-500">+{OPTION_PRICES.gps} MAD</span>
                                            </div>
                                        )}
                                        {options.extraDriver && (
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Additional Driver</span>
                                                <span className="font-bold text-orange-500">+{OPTION_PRICES.extraDriver} MAD</span>
                                            </div>
                                        )}
                                        {options.insurance === "premium" && (
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">Premium Protection ({OPTION_PRICES.premiumInsurance} × {days})</span>
                                                <span className="font-bold text-orange-500">+{OPTION_PRICES.premiumInsurance * days} MAD</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4">
                                <div className="relative p-6 rounded-3xl bg-primary shadow-2xl shadow-primary/30 overflow-hidden isolate">
                                    <div className="absolute top-0 right-0 h-24 w-24 bg-white/20 blur-3xl -z-10" />
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-0.5">Final Total</p>
                                            <p className="text-4xl font-black text-white tracking-tighter tabular-nums">{total} <span className="text-lg">MAD</span></p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black text-white uppercase mb-1">All Incl.</div>
                                            <p className="text-[10px] text-white/60">Tax & Fees included</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full h-16 rounded-2xl bg-slate-950 text-white font-black tracking-widest uppercase hover:bg-slate-900 group shadow-2xl transition-all active:scale-[0.98]"
                                onClick={handlePayment}
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <Spinner className="mr-2" />
                                        Confirming...
                                    </>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Lock className="h-4 w-4 transition-transform group-hover:scale-125" />
                                        Complete Booking
                                    </span>
                                )}
                            </Button>

                            <div className="flex items-center justify-center gap-2 pt-2">
                                <div className="h-1 w-1 rounded-full bg-primary" />
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Secure Reservation Engine v3.0</span>
                                <div className="h-1 w-1 rounded-full bg-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={null}>
            <CheckoutContent />
        </Suspense>
    );
}
