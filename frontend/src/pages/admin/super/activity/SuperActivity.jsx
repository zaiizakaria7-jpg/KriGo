import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Activity, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SuperActivityPage() {
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const token = localStorage.getItem("krigo_token");
                const res = await fetch("http://localhost:5000/api/dashboard/activity", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setActivityLogs(data);
                } else {
                    toast.error("Failed to fetch activity logs");
                }
            } catch (error) {
                console.error("Error fetching activity:", error);
                toast.error("Error loading activity");
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
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
                    <h1 className="text-2xl font-bold text-[hsl(0,0%,96%)]">
                        Activity Log
                    </h1>
                    <p className="text-sm text-[hsl(220,10%,50%)]">
                        Recent activity across the platform (Reservations, Users).
                    </p>
                </div>

                <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]">
                    <CardContent className="p-0">
                        {activityLogs.length === 0 ? (
                            <div className="p-8 text-center text-[hsl(220,10%,50%)]">
                                No recent activity found.
                            </div>
                        ) : (
                            <div className="divide-y divide-[hsl(220,14%,13%)]">
                                {activityLogs.map((log, index) => (
                                    <div
                                        key={log._id || index}
                                        className="flex items-start gap-4 px-6 py-4 hover:bg-[hsl(220,14%,10%)] transition-colors"
                                    >
                                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(220,14%,14%)]">
                                            <Activity className="h-3.5 w-3.5 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm text-[hsl(0,0%,88%)]">
                                                <span className="font-semibold">{log.userName || "System"}</span>{" "}
                                                <span className="text-[hsl(220,10%,55%)]">
                                                    {log.action?.toLowerCase()}
                                                </span>
                                            </p>
                                            <p className="mt-0.5 text-sm text-[hsl(220,10%,45%)]">
                                                {log.target}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-xs text-[hsl(220,10%,38%)] text-right">
                                            <p>{format(new Date(log.timestamp), "MMM d, yyyy")}</p>
                                            <p>{format(new Date(log.timestamp), "h:mm a")}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminShell>
    );
}
