import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SuperAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [vehicleStats, setVehicleStats] = useState([]);
    const [bookingStats, setBookingStats] = useState([]);
    const [kpis, setKpis] = useState({
        avgBookingValue: 0,
        occupancyRate: 0,
        monthlyGrowth: 0,
        retention: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("krigo_token");
                const headers = { Authorization: `Bearer ${token}` };

                // 1. Fetch Dashboard Stats (Revenue, General Counts)
                const statsRes = await fetch("http://localhost:5000/api/dashboard/stats", { headers });
                const statsData = await statsRes.json();

                if (statsData.monthlyRevenue) {
                    setMonthlyRevenue(statsData.monthlyRevenue);
                }

                // 2. Fetch All Vehicles to calculate Type Distribution
                const vehiclesRes = await fetch("http://localhost:5000/api/vehicles", { headers });
                const vehiclesData = await vehiclesRes.json();

                const typeCounts = {};
                vehiclesData.forEach(v => {
                    const type = v.type === "trottinette" ? "scooter" : v.type;
                    typeCounts[type] = (typeCounts[type] || 0) + 1;
                });

                const vehicleTypeData = Object.keys(typeCounts).map(type => ({
                    type: type.charAt(0).toUpperCase() + type.slice(1),
                    count: typeCounts[type],
                    fill: type === 'car' ? 'hsl(217, 91%, 60%)' :
                        type === 'moto' ? 'hsl(142, 71%, 45%)' :
                            type === 'scooter' ? 'hsl(27, 87%, 67%)' : 'hsl(220, 10%, 50%)'
                }));
                setVehicleStats(vehicleTypeData);

                // 3. Fetch All Reservations to calculate Status Distribution & Avg Booking Value
                const reservationsRes = await fetch("http://localhost:5000/api/reservations", { headers });
                const reservationsData = await reservationsRes.json();

                const statusCounts = {};
                let totalRevenue = 0;
                let completedCount = 0;

                reservationsData.forEach(r => {
                    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
                    if (r.status === 'accepted' || r.status === 'completed') {
                        totalRevenue += r.totalPrice;
                        completedCount++;
                    }
                });

                const statusData = Object.keys(statusCounts).map(status => ({
                    status: status.charAt(0).toUpperCase() + status.slice(1),
                    count: statusCounts[status],
                    fill: status === 'accepted' ? 'hsl(142, 71%, 45%)' :
                        status === 'pending' ? 'hsl(45, 93%, 47%)' :
                            status === 'cancelled' ? 'hsl(0, 84%, 60%)' :
                                status === 'refused' ? 'hsl(0, 84%, 60%)' : 'hsl(220, 10%, 50%)'
                }));
                setBookingStats(statusData);

                // KPI Calculations (Simplified/Mock logic where real data missing)
                const avgBookingValue = completedCount > 0 ? totalRevenue / completedCount : 0;

                setKpis({
                    avgBookingValue: `${Math.round(avgBookingValue).toLocaleString()} MAD`,
                    occupancyRate: "72%", // Mock for now, hard to calc without availability history
                    monthlyGrowth: "+12%", // Mock
                    retention: "65%" // Mock
                });

            } catch (error) {
                console.error("Error fetching analytics:", error);
                toast.error("Failed to load analytics data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <AdminShell requiredRole="admin_super">
                <div className="flex h-96 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AdminShell>
        );
    }

    return (
        <AdminShell requiredRole="admin_super">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(0,0%,96%)]">Analytics</h1>
                    <p className="text-sm text-[hsl(220,10%,50%)]">
                        Platform performance metrics and insights based on real data.
                    </p>
                </div>

                {/* Top metric cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: "Avg. Booking Value", value: kpis.avgBookingValue },
                        { label: "Occupancy Rate", value: kpis.occupancyRate },
                        { label: "Monthly Growth", value: kpis.monthlyGrowth },
                        { label: "Customer Retention", value: kpis.retention },
                    ].map((m) => (
                        <Card
                            key={m.label}
                            className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]"
                        >
                            <CardContent className="p-5">
                                <p className="text-xs font-medium text-[hsl(220,10%,50%)] uppercase tracking-wider">
                                    {m.label}
                                </p>
                                <p className="mt-2 text-2xl font-bold text-[hsl(0,0%,96%)]">
                                    {m.value}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Revenue chart */}
                <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-[hsl(0,0%,85%)]">
                            Revenue Over Time (MAD)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyRevenue}>
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
                                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
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

                {/* Pie charts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-[hsl(0,0%,85%)]">
                                Fleet by Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={vehicleStats}
                                            dataKey="count"
                                            nameKey="type"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            stroke="hsl(220,20%,9%)"
                                            strokeWidth={3}
                                        >
                                            {vehicleStats.map((entry, i) => (
                                                <Cell key={entry.type} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Legend
                                            formatter={(value) => (
                                                <span style={{ color: "hsl(220,10%,60%)", fontSize: "12px" }}>
                                                    {value}
                                                </span>
                                            )}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(220,20%,12%)",
                                                border: "1px solid hsl(220,14%,20%)",
                                                borderRadius: "8px",
                                                color: "hsl(0,0%,90%)",
                                                fontSize: "12px",
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-[hsl(0,0%,85%)]">
                                Bookings by Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={bookingStats}
                                            dataKey="count"
                                            nameKey="status"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            stroke="hsl(220,20%,9%)"
                                            strokeWidth={3}
                                        >
                                            {bookingStats.map((entry, i) => (
                                                <Cell key={entry.status} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Legend
                                            formatter={(value) => (
                                                <span style={{ color: "hsl(220,10%,60%)", fontSize: "12px" }}>
                                                    {value}
                                                </span>
                                            )}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(220,20%,12%)",
                                                border: "1px solid hsl(220,14%,20%)",
                                                borderRadius: "8px",
                                                color: "hsl(0,0%,90%)",
                                                fontSize: "12px",
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminShell>
    );
}
