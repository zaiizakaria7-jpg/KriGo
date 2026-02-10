import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const statusColors = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    accepted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    refused: "bg-red-500/10 text-red-500 border-red-500/20",
    cancelled: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
    completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

export default function SuperReservationsPage() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem("krigo_token");
            const res = await fetch("http://localhost:5000/api/reservations", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReservations(data);
            } else {
                toast.error("Failed to fetch reservations");
            }
        } catch (error) {
            console.error("Failed to fetch reservations", error);
            toast.error("Error fetching reservations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const filtered =
        statusFilter === "all"
            ? reservations
            : reservations.filter((r) => r.status === statusFilter);

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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[hsl(0,0%,96%)]">
                            All Reservations
                        </h1>
                        <p className="text-sm text-[hsl(220,10%,50%)]">
                            View reservations across all agencies.
                        </p>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40 bg-[hsl(220,20%,9%)] border-[hsl(220,14%,18%)] text-[hsl(0,0%,96%)]">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent className="border-[hsl(220,14%,18%)] bg-[hsl(220,20%,12%)]">
                            <SelectItem value="all" className="text-[hsl(0,0%,90%)]">
                                All
                            </SelectItem>
                            <SelectItem value="pending" className="text-[hsl(0,0%,90%)]">
                                Pending
                            </SelectItem>
                            <SelectItem value="accepted" className="text-[hsl(0,0%,90%)]">
                                Accepted
                            </SelectItem>
                            <SelectItem value="refused" className="text-[hsl(0,0%,90%)]">
                                Refused
                            </SelectItem>
                            <SelectItem value="cancelled" className="text-[hsl(0,0%,90%)]">
                                Cancelled
                            </SelectItem>
                            <SelectItem value="completed" className="text-[hsl(0,0%,90%)]">
                                Completed
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-[hsl(220,14%,14%)] hover:bg-transparent">
                                        <TableHead className="text-[hsl(220,10%,45%)]">Vehicle</TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">Customer</TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">Dates</TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">Total</TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-[hsl(220,10%,50%)]">
                                                No reservations found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filtered.map((r) => (
                                            <TableRow
                                                key={r._id}
                                                className="border-[hsl(220,14%,12%)] hover:bg-[hsl(220,14%,10%)]"
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative h-10 w-14 overflow-hidden rounded-md bg-[hsl(220,14%,14%)]">
                                                            <img
                                                                src={r.vehicle?.image || "/placeholder.svg"}
                                                                alt={`${r.vehicle?.brand} ${r.vehicle?.model}`}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                        <p className="text-sm font-medium text-[hsl(0,0%,90%)]">
                                                            {r.vehicle?.brand} {r.vehicle?.model}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-[hsl(220,10%,50%)]">
                                                    {r.user ? `${r.user.prenom} ${r.user.nom}` : "Unknown User"}
                                                </TableCell>
                                                <TableCell className="text-sm text-[hsl(220,10%,50%)]">
                                                    {format(new Date(r.startDate), "MMM d")} -{" "}
                                                    {format(new Date(r.endDate), "MMM d, yyyy")}
                                                </TableCell>
                                                <TableCell className="text-sm font-medium text-[hsl(0,0%,85%)]">
                                                    {r.totalPrice?.toLocaleString()} MAD
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`capitalize ${statusColors[r.status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}
                                                    >
                                                        {r.status}
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
