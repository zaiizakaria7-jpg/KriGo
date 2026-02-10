import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SuperVehiclesPage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchVehicles = async () => {
        try {
            const token = localStorage.getItem("krigo_token");
            const res = await fetch("http://localhost:5000/api/vehicles", {
                headers: { Authorization: `Bearer ${token}` } // Send token although it's public, just in case backend logic changes
            });
            if (res.ok) {
                const data = await res.json();
                setVehicles(data);
            } else {
                toast.error("Failed to fetch vehicles");
            }
        } catch (error) {
            console.error("Failed to fetch vehicles", error);
            toast.error("Error fetching vehicles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const filtered = vehicles.filter((v) => {
        const term = search.toLowerCase();
        return (
            v.brand?.toLowerCase().includes(term) ||
            v.model?.toLowerCase().includes(term) ||
            v.type?.toLowerCase().includes(term) ||
            v.agency?.name?.toLowerCase().includes(term)
        );
    });

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
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white font-heading">
                        All Vehicles
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage all vehicles across all agencies.
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(220,10%,40%)]" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search vehicles..."
                            className="pl-10 bg-[hsl(220,20%,9%)] border-[hsl(220,14%,18%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)]"
                        />
                    </div>
                    <Badge variant="outline" className="ml-2 border-[hsl(220,14%,20%)] text-[hsl(0,0%,75%)]">
                        Total: {filtered.length}
                    </Badge>
                </div>

                <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-[hsl(220,14%,14%)] hover:bg-transparent">
                                        <TableHead className="text-[hsl(220,10%,45%)]">Vehicle</TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">Type</TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">Agency</TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">Price/Day</TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-[hsl(220,10%,50%)]">
                                                No vehicles found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filtered.map((v) => (
                                            <TableRow
                                                key={v._id}
                                                className="border-[hsl(220,14%,12%)] hover:bg-[hsl(220,14%,10%)]"
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative h-10 w-14 overflow-hidden rounded-md bg-[hsl(220,14%,14%)]">
                                                            <img
                                                                src={v.image || "/placeholder.svg"}
                                                                alt={`${v.brand} ${v.model}`}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-[hsl(0,0%,90%)]">
                                                                {v.brand} {v.model}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="border-[hsl(220,14%,20%)] text-[hsl(0,0%,75%)] capitalize"
                                                    >
                                                        {v.type === "trottinette" ? "scooter" : v.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-[hsl(220,10%,50%)]">
                                                    {v.agency?.name || "Unknown Agency"}
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-[hsl(0,0%,85%)]">
                                                    {v.price_per_day} MAD
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            v.availability
                                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                                : "bg-red-500/10 text-red-400 border-red-500/20"
                                                        }
                                                    >
                                                        {v.availability ? "Available" : "Unavailable"}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminShell>
    );
}
