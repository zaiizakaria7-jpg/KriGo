import React from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Building2,
    Car,
    CalendarDays,
    DollarSign,
    TrendingUp,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle
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

export default function SuperDashboard() {
    const [statsData, setStatsData] = React.useState({
        revenue: 0,
        vehiclesCount: 0,
        reservationsCount: 0,
        agenciesCount: 0,
        adminUsersCount: 0,
        totalCustomersCount: 0,
        monthlyRevenue: [],
        recentReservations: [],
        recentLogins: []
    });
    const [loading, setLoading] = React.useState(true);

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
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const dashboardStats = [
        {
            label: "Total Revenue",
            value: `${statsData.revenue.toLocaleString()} MAD`,
            change: "+12.5%", // Mock change for now
            up: true,
            icon: DollarSign,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
        },
        {
            label: "Total Vehicles",
            value: statsData.vehiclesCount.toString(),
            change: "+3", // Mock change
            up: true,
            icon: Car,
            color: "text-sky-400",
            bg: "bg-sky-500/10",
        },
        {
            label: "Reservations",
            value: statsData.reservationsCount.toString(),
            change: "+8", // Mock change
            up: true,
            icon: CalendarDays,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
        },
        {
            label: "Total Agencies",
            value: statsData.agenciesCount?.toString() || "0",
            change: "0",
            up: true,
            icon: Building2,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
        },
        {
            label: "Admin Users",
            value: statsData.adminUsersCount?.toString() || "0",
            change: "+1",
            up: true,
            icon: Users,
            color: "text-rose-400",
            bg: "bg-rose-500/10",
        },
        {
            label: "Total Customers",
            value: statsData.totalCustomersCount?.toString() || "0",
            change: "+5",
            up: true,
            icon: Users,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
        },
        {
            label: "Growth",
            value: "+18.2%",
            change: "vs last month",
            up: true,
            icon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
        },
    ];

    return (
        <AdminShell requiredRole="admin_super">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white font-heading">
                        Overview
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome back. Here's what's happening across your platform today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {dashboardStats.map((stat) => (
                        <Card
                            key={stat.label}
                            className="relative overflow-hidden border-white/5 bg-gradient-to-br from-[hsl(220,20%,10%)] to-[hsl(220,20%,8%)] transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group"
                        >
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${stat.bg.replace('/10', '/30')}`} />
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-[hsl(220,10%,50%)] uppercase tracking-wider">
                                            {stat.label}
                                        </p>
                                        <p className="text-2xl font-bold text-[hsl(0,0%,96%)]">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
                                    >
                                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-1.5">
                                    {stat.up ? (
                                        <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                                    ) : (
                                        <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                                    )}
                                    <span className="text-xs font-medium text-emerald-400">
                                        {stat.change}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Revenue Chart + Recent Activity */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                    {/* Revenue Chart */}
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
                                            formatter={(value) => [`${value.toLocaleString()} MAD`, "Revenue"]}
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

                    {/* Recent Activities Grid */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:col-span-5">
                        {/* Recent Reservations */}
                        <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]">
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
                                        className={`flex items-center justify-between py-3 ${i !== 0 ? "border-t border-[hsl(220,14%,14%)]" : ""}`}
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-[hsl(0,0%,88%)] truncate">
                                                {res.vehicle?.brand} {res.vehicle?.model || "Unknown"}
                                            </p>
                                            <p className="text-xs text-[hsl(220,10%,45%)]">
                                                {format(new Date(res.startDate), "MMM d")} - {format(new Date(res.endDate), "MMM d")}
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

                        {/* Recent Logins */}
                        <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-[hsl(0,0%,85%)]">
                                    Recent Logins
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-0">
                                {(!statsData.recentLogins || statsData.recentLogins.length === 0) && (
                                    <p className="text-sm text-[hsl(220,10%,50%)] py-4 border-t border-[hsl(220,14%,14%)]">No recent logins recorded.</p>
                                )}
                                {statsData.recentLogins?.map((u, i) => (
                                    <div
                                        key={u._id}
                                        className={`flex items-center justify-between py-3 ${i !== 0 ? "border-t border-[hsl(220,14%,14%)]" : ""}`}
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-[hsl(0,0%,88%)] truncate">
                                                {u.prenom ? `${u.prenom} ${u.nom}` : u.name || u.email}
                                            </p>
                                            <p className="text-xs text-[hsl(220,10%,45%)]">
                                                {u.email}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-medium text-[hsl(220,10%,55%)] uppercase tracking-wider">
                                                {format(new Date(u.lastLogin), "HH:mm")}
                                            </p>
                                            <p className="text-[10px] text-[hsl(220,10%,40%)]">
                                                {format(new Date(u.lastLogin), "MMM d")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
