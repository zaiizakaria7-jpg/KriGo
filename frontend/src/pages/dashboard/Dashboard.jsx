import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "@/lib/user-auth-context";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    CalendarDays,
    CreditCard,
    Car,
    User,
    ExternalLink,
    XCircle,
    ArrowUpRight,
    TrendingUp,
    Clock,
    CheckCircle2,
    ChevronRight,
    LayoutDashboard,
    Wallet
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const { user, loading } = useUserAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("reservations");
    const [reservations, setReservations] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const userReservations = reservations;
    const userPayments = []; // Placeholder

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
            return;
        }

        if (user) {
            fetchReservations();
        }
    }, [user, loading, navigate]);

    async function fetchReservations() {
        try {
            const token = localStorage.getItem("krigo_token");
            const res = await fetch("/api/reservations", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReservations(data);
            }
        } catch (err) {
            console.error("Failed to fetch reservations", err);
            toast.error("Failed to load your reservations");
        } finally {
            setIsLoadingData(false);
        }
    }

    if (loading || isLoadingData) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <LayoutDashboard className="h-10 w-10 animate-pulse text-primary" />
                    <p className="text-muted-foreground animate-pulse">Building your dashboard...</p>
                </div>
            </div>
        );
    }

    const userName = user?.prenom
        ? `${user.prenom} ${user.nom}`
        : user?.name || user?.email || "User";

    const userInitials = user?.prenom
        ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase()
        : (user?.name || user?.email || "U")[0].toUpperCase();

    const activeReservations = userReservations.filter((r) => r.status === "accepted").length;
    const pendingReservations = userReservations.filter((r) => r.status === "pending").length;

    return (
        <div className="min-h-screen bg-transparent pb-20">
            {/* Dynamic Header */}
            <div className="relative h-64 w-full overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-slate-900 to-slate-950" />
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8 h-full flex flex-col justify-center pt-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5 translate-y-2 animate-in slide-in-from-left duration-700">
                            <div className="relative">
                                <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-white/10 shadow-2xl ring-1 ring-white/20">
                                    <AvatarImage
                                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.email}&backgroundColor=0084ff,039be5,0288d1&backgroundType=gradientLinear&chars=1`}
                                        alt={userName}
                                    />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-green-500 border-4 border-slate-950 flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-white animate-ping" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-heading">
                                    Welcome back, <span className="text-primary">{user?.prenom || "Adventurer"}</span>!
                                </h1>
                                <p className="text-slate-400 mt-1 flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Last login: today at {new Date().getHours()}:00
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 animate-in slide-in-from-right duration-700">
                            <Button variant="outline" asChild className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl">
                                <Link to="/profile">
                                    <User className="mr-2 h-4 w-4" /> Edit Profile
                                </Link>
                            </Button>
                            <Button className="rounded-xl shadow-lg shadow-primary/20 bg-primary group" asChild>
                                <Link to="/vehicles">
                                    New Booking <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                {/* Stats Cards - Floating style */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4 -mt-10 relative z-20 animate-in slide-in-from-bottom duration-700 delay-200 fill-mode-both">
                    <Card className="border border-border/50 bg-card/80 dark:bg-background/60 backdrop-blur-xl shadow-sm dark:shadow-xl hover:shadow-md dark:hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
                        <CardContent className="flex items-center gap-5 p-6 h-full relative">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                                <CalendarDays className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-foreground">{userReservations.length}</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-0.5 text-[10px]">Reservations</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/50 bg-card/80 dark:bg-background/60 backdrop-blur-xl shadow-sm dark:shadow-xl hover:shadow-md dark:hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-green-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
                        <CardContent className="flex items-center gap-5 p-6 h-full relative">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 transition-colors group-hover:bg-green-500/20">
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-foreground">{activeReservations}</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-0.5 text-[10px]">Confirmed</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-border/50 bg-card/40 dark:bg-background/60 backdrop-blur-xl shadow-sm dark:shadow-xl hover:shadow-md dark:hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />
                        <CardContent className="flex items-center gap-5 p-6 h-full relative">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 transition-colors group-hover:bg-amber-500/20">
                                <Clock className="h-6 w-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-foreground">{pendingReservations}</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-0.5 text-[10px]">Waiting</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-indigo-600 shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 group overflow-hidden border-none text-white">
                        <div className="absolute bottom-0 right-0 h-32 w-32 bg-white/10 rounded-full -mb-16 -mr-16 transition-transform group-hover:scale-150" />
                        <CardContent className="flex flex-col justify-center p-6 h-full relative">
                            <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Estimated Wallet</p>
                            <div className="flex items-end gap-1">
                                <p className="text-2xl font-black">{userPayments.reduce((sum, p) => (p.status === "completed" ? sum + p.amount : sum), 0).toLocaleString()}</p>
                                <p className="text-sm font-bold opacity-80 mb-1">MAD</p>
                            </div>
                            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold py-1 px-2 rounded-lg bg-white/10 w-fit">
                                <TrendingUp className="h-3 w-3" /> 12% from last month
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-12">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                            <TabsList className="bg-muted/30 p-1 md:h-12 rounded-xl backdrop-blur-sm self-start">
                                <TabsTrigger value="reservations" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-lg h-full px-6">
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    My Bookings
                                </TabsTrigger>
                                <TabsTrigger value="payments" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-lg h-full px-6">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Payments
                                </TabsTrigger>
                            </TabsList>

                            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground italic">
                                <Clock className="h-3.5 w-3.5 text-primary/60" />
                                Updated just now
                            </div>
                        </div>

                        <TabsContent value="reservations" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {userReservations.length === 0 ? (
                                <Card className="p-12 text-center border-dashed border-2 bg-muted/5">
                                    <div className="bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Car className="h-10 w-10 text-primary opacity-60" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
                                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Explore Morocco with our premium selection of vehicles. Start your adventure today!</p>
                                    <Button asChild size="lg" className="rounded-xl px-8">
                                        <Link to="/vehicles">Browse Vehicles</Link>
                                    </Button>
                                </Card>
                            ) : (
                                <>
                                    {/* Mobile Cards */}
                                    <div className="space-y-4 md:hidden">
                                        {userReservations.map((res) => (
                                            <Card key={res._id} className="border border-border/50 bg-card/40 dark:bg-background/40 backdrop-blur-sm overflow-hidden">
                                                <CardContent className="p-4">
                                                    <div className="flex gap-4">
                                                        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                                                            <img
                                                                src={res.vehicle.image || "/placeholder.svg"}
                                                                alt={`${res.vehicle.brand} ${res.vehicle.model}`}
                                                                className="object-cover w-full h-full transition-transform hover:scale-110"
                                                            />
                                                            <div className="absolute top-1 left-1">
                                                                <Badge className="h-5 text-[9px] bg-slate-900/80 backdrop-blur-md border-white/10 uppercase">
                                                                    {res.vehicle.type}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h3 className="font-bold text-foreground mb-0.5 leading-tight">
                                                                        {res.vehicle.brand} {res.vehicle.model}
                                                                    </h3>
                                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{res.vehicle.agency.name}</p>
                                                                </div>
                                                                <StatusBadge status={res.status} />
                                                            </div>
                                                            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                                                                <p className="text-xs font-bold text-primary">{res.totalPrice.toLocaleString()} MAD</p>
                                                                <Button variant="ghost" size="sm" asChild className="h-8 rounded-lg">
                                                                    <Link to={`/vehicles/${res.vehicle._id}`}>Details</Link>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {/* Desktop Table - Premium Look */}
                                    <Card className="hidden border border-border/50 bg-card/40 dark:bg-background/40 backdrop-blur-sm overflow-hidden md:block shadow-sm dark:shadow-xl">
                                        <CardContent className="p-0">
                                            <Table>
                                                <TableHeader className="bg-muted/30">
                                                    <TableRow className="border-white/5 hover:bg-transparent">
                                                        <TableHead className="text-foreground pl-6 h-14 font-bold uppercase text-[10px] tracking-widest">Selected Vehicle</TableHead>
                                                        <TableHead className="text-foreground h-14 font-bold uppercase text-[10px] tracking-widest">Duration & Dates</TableHead>
                                                        <TableHead className="text-foreground h-14 font-bold uppercase text-[10px] tracking-widest">Financials</TableHead>
                                                        <TableHead className="text-foreground h-14 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                                                        <TableHead className="text-foreground text-right pr-6 h-14 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {userReservations.map((res) => (
                                                        <TableRow key={res._id} className="border-white/5 group hover:bg-white/[0.02] transition-colors h-24">
                                                            <TableCell className="pl-6">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="relative h-14 w-20 overflow-hidden rounded-xl bg-card border border-white/5 shadow-inner">
                                                                        <img
                                                                            src={res.vehicle.image || "/placeholder.svg"}
                                                                            alt={`${res.vehicle.brand} ${res.vehicle.model}`}
                                                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                                                                            {res.vehicle.brand} {res.vehicle.model}
                                                                        </p>
                                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                                            <Badge variant="secondary" className="h-4 text-[8px] uppercase tracking-tighter bg-muted font-bold">{res.vehicle.type}</Badge>
                                                                            <span className="text-[10px] text-muted-foreground">• at {res.vehicle.agency.location}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col gap-1">
                                                                    <p className="text-sm font-semibold text-foreground">
                                                                        {format(new Date(res.startDate), "MMM d, yyyy")}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                                                                        <span>To {format(new Date(res.endDate), "MMM d")}</span>
                                                                        <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                                                                        <Clock className="h-3 w-3" />
                                                                        <span>{Math.ceil((new Date(res.endDate) - new Date(res.startDate)) / (1000 * 60 * 60 * 24))} Days</span>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col">
                                                                    <p className="font-black text-lg text-foreground tracking-tight">{res.totalPrice.toLocaleString()} <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-80">MAD</span></p>
                                                                    <p className="text-[10px] text-muted-foreground font-medium italic">Confirmed Price</p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <StatusBadge status={res.status} className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider" />
                                                            </TableCell>
                                                            <TableCell className="text-right pr-6">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Button variant="outline" size="sm" asChild className="h-9 w-9 p-0 rounded-xl border-white/5 bg-white/5 hover:bg-primary hover:text-white transition-all">
                                                                        <Link to={`/vehicles/${res.vehicle._id}`}>
                                                                            <ChevronRight className="h-4 w-4" />
                                                                        </Link>
                                                                    </Button>
                                                                    {res.status === "pending" && (
                                                                        <Button variant="ghost" size="sm" onClick={() => toast.error("Cancellation requires admin approval")} className="h-9 w-9 p-0 rounded-xl text-destructive hover:bg-destructive/10">
                                                                            <XCircle className="h-4.5 w-4.5" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </>
                            )}
                        </TabsContent>

                        <TabsContent value="payments" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="p-12 text-center border-dashed border-2 bg-muted/5">
                                <div className="bg-indigo-500/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Wallet className="h-10 w-10 text-indigo-500 opacity-60" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Payment History</h3>
                                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Your billing details and secure transactions will appear here once you've completed a booking.</p>
                                <Button variant="outline" className="rounded-xl border-white/10">Download Statement</Button>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
