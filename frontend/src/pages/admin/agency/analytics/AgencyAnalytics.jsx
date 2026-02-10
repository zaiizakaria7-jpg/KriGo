import React from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { monthlyRevenue, bookingsByStatus } from "@/lib/admin-mock-data";
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

export default function AgencyAnalyticsPage() {
    const [statsData, setStatsData] = React.useState({
        revenue: 0,
        vehiclesCount: 0,
        reservationsCount: 0,
        pendingCount: 0,
        acceptedCount: 0,
        monthlyRevenue: [],
        recentReservations: []
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
                console.error("Failed to fetch analytics stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Derived stats
    const avgBookingValue = statsData.acceptedCount > 0
        ? Math.round(statsData.revenue / statsData.acceptedCount)
        : 0;

    // Utilization is tricky without historical data, but let's use a ratio of accepted reservations to vehicles (simplified)
    const utilization = statsData.vehiclesCount > 0
        ? Math.min(Math.round((statsData.acceptedCount / statsData.vehiclesCount) * 10), 100) // This is a placeholder logic
        : 0;

    const bookingsByStatusData = [
        { status: "Pending", count: statsData.pendingCount, fill: "hsl(45, 93%, 47%)" },
        { status: "Accepted", count: statsData.acceptedCount, fill: "hsl(142, 71%, 45%)" },
        {
            status: "Refused/Cancelled",
            count: statsData.reservationsCount - (statsData.pendingCount + statsData.acceptedCount),
            fill: "hsl(0, 84%, 60%)"
        },
    ];

    return (
        <AdminShell requiredRole="admin_agency">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(0,0%,96%)]">Analytics</h1>
                    <p className="text-sm text-[hsl(220,10%,50%)]">
                        Track your agency performance and booking trends.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                        { label: "Avg. Booking Value", value: `${avgBookingValue.toLocaleString()} MAD` },
                        { label: "Fleet Utilization", value: `${utilization}%` },
                        { label: "This Month Revenue", value: `${statsData.revenue.toLocaleString()} MAD` },
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

                <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-[hsl(0,0%,85%)]">
                            Monthly Revenue (MAD)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statsData.monthlyRevenue}>
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
                                        data={bookingsByStatusData}
                                        dataKey="count"
                                        nameKey="status"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        stroke="hsl(220,20%,9%)"
                                        strokeWidth={3}
                                    >
                                        {bookingsByStatusData.map((entry) => (
                                            <Cell key={entry.status} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Legend
                                        formatter={(value) => (
                                            <span
                                                style={{
                                                    color: "hsl(220,10%,60%)",
                                                    fontSize: "12px",
                                                }}
                                            >
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
        </AdminShell>
    );
}
