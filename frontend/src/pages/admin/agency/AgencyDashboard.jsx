import React from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useUserAuth } from "@/lib/user-auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Car,
    Clock,
    CheckCircle,
    DollarSign
} from "lucide-react";
import { format } from "date-fns";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const statusColors = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    refused: "bg-red-500/10 text-red-400 border-red-500/20",
    cancelled: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function AgencyDashboard() {
    const [statsData, setStatsData] = React.useState({
        revenue: 0,
        vehiclesCount: 0,
        reservationsCount: 0,
        pendingCount: 0,
        acceptedCount: 0,
        monthlyRevenue: [],
        recentReservations: []
    });
    const { user } = useUserAuth();

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("krigo_token");
                const res = await fetch("http://localhost:5000/api/dashboard/stats", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStatsData(data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    const pendingCount = statsData.pendingCount;
    const acceptedCount = statsData.acceptedCount;
    const totalRevenue = statsData.revenue;

    return (
        <AdminShell requiredRole="admin_agency">
            <div className="space-y-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white font-heading">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome back, <span className="font-semibold text-foreground">{user?.prenom}</span>. Here is your agency overview.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden border-white/5 bg-gradient-to-br from-[hsl(220,20%,10%)] to-[hsl(220,20%,8%)] hover:border-sky-500/30 transition-all duration-300 group">
                        <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-[hsl(220,10%,50%)] uppercase tracking-wider">
                                        My Vehicles
                                    </p>
                                    <p className="text-2xl font-bold text-[hsl(0,0%,96%)]">
                                        {statsData.vehiclesCount}
                                    </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10">
                                    <Car className="h-5 w-5 text-sky-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden border-white/5 bg-gradient-to-br from-[hsl(220,20%,10%)] to-[hsl(220,20%,8%)] hover:border-amber-500/30 transition-all duration-300 group">
                        <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-[hsl(220,10%,50%)] uppercase tracking-wider">
                                        Pending
                                    </p>
                                    <p className="text-2xl font-bold text-amber-400 font-heading">
                                        {pendingCount}
                                    </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                                    <Clock className="h-5 w-5 text-amber-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden border-white/5 bg-gradient-to-br from-[hsl(220,20%,10%)] to-[hsl(220,20%,8%)] hover:border-emerald-500/30 transition-all duration-300 group">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-[hsl(220,10%,50%)] uppercase tracking-wider">
                                        Accepted
                                    </p>
                                    <p className="text-2xl font-bold text-emerald-400 font-heading">
                                        {acceptedCount}
                                    </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden border-white/5 bg-gradient-to-br from-[hsl(220,20%,10%)] to-[hsl(220,20%,8%)] hover:border-emerald-500/30 transition-all duration-300 group">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-[hsl(220,10%,50%)] uppercase tracking-wider">
                                        Revenue
                                    </p>
                                    <p className="text-2xl font-bold text-white font-heading">
                                        {totalRevenue.toLocaleString()} MAD
                                    </p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                                    <DollarSign className="h-5 w-5 text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                    {/* Chart */}
                    <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)] lg:col-span-3">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-[hsl(0,0%,85%)]">
                                Monthly Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statsData.monthlyRevenue || []}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="hsl(220,14%,16%)"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fill: "hsl(220,10%,45%)", fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fill: "hsl(220,10%,45%)", fontSize: 12 }}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(220,20%,12%)",
                                                border: "1px solid hsl(220,14%,20%)",
                                                borderRadius: "8px",
                                                color: "hsl(0,0%,90%)",
                                                fontSize: "12px",
                                            }}
                                            formatter={(value) => [
                                                `${value.toLocaleString()} MAD`,
                                                "Revenue",
                                            ]}
                                        />
                                        <Bar
                                            dataKey="revenue"
                                            fill="hsl(160,84%,39%)"
                                            radius={[6, 6, 0, 0]}
                                            maxBarSize={48}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Reservations */}
                    <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)] lg:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-[hsl(0,0%,85%)]">
                                Recent Reservations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-0">
                            {(!statsData.recentReservations || statsData.recentReservations.length === 0) && (
                                <p className="text-sm text-[hsl(220,10%,50%)] py-4">No recent reservations.</p>
                            )}
                            {statsData.recentReservations?.map((res, i) => (
                                <div
                                    key={res._id}
                                    className={`flex items-center justify-between py-3 ${i !== 0 ? "border-t border-[hsl(220,14%,14%)]" : ""
                                        }`}
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-[hsl(0,0%,88%)] truncate">
                                            {res.vehicle?.brand} {res.vehicle?.model || "Unknown Model"}
                                        </p>
                                        <p className="text-xs text-[hsl(220,10%,45%)]">
                                            {format(new Date(res.startDate), "MMM d")} -{" "}
                                            {format(new Date(res.endDate), "MMM d")}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`shrink-0 capitalize text-xs ${statusColors[res.status] || ""}`}
                                    >
                                        {res.status}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminShell>
    );
}
