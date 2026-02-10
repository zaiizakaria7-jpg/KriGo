import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useUserAuth } from "@/lib/user-auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const statusColors = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    accepted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    refused: "bg-red-500/10 text-red-400 border-red-500/20",
    cancelled: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function AgencyReservationsPage() {
    const { user } = useUserAuth();
    const [resList, setResList] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem("krigo_token");
            const res = await fetch("http://localhost:5000/api/reservations", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setResList(data);
            }
        } catch (error) {
            console.error("Failed to fetch reservations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchReservations();
        }
    }, [user]);

    const filtered =
        statusFilter === "all"
            ? resList
            : resList.filter((r) => r.status === statusFilter);

    async function handleStatusUpdate(id, newStatus) {
        try {
            const token = localStorage.getItem("krigo_token");
            const res = await fetch(`http://localhost:5000/api/reservations/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                toast.success(`Reservation ${newStatus}.`);
                fetchReservations();
            } else {
                const err = await res.json();
                throw new Error(err.message || "Failed to update status");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }

    return (
        <AdminShell requiredRole="admin_agency">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[hsl(0,0%,96%)]">
                            Reservations
                        </h1>
                        <p className="text-sm text-[hsl(220,10%,50%)]">
                            Manage booking requests for your vehicles.
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
                        </SelectContent>
                    </Select>
                </div>

                <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-[hsl(220,14%,14%)] hover:bg-transparent">
                                        <TableHead className="text-[hsl(220,10%,45%)]">
                                            Vehicle
                                        </TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">
                                            Customer
                                        </TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">
                                            Dates
                                        </TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">
                                            Total
                                        </TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-right text-[hsl(220,10%,45%)]">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-[hsl(220,10%,50%)]">
                                                No reservations found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filtered.map((res) => (
                                        <TableRow
                                            key={res._id}
                                            className="border-[hsl(220,14%,12%)] hover:bg-[hsl(220,14%,10%)]"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-10 w-14 overflow-hidden rounded-md bg-[hsl(220,14%,14%)]">
                                                        <img
                                                            src={res.vehicle?.image || "/placeholder.svg"}
                                                            alt={`${res.vehicle?.brand} ${res.vehicle?.model}`}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                    <p className="text-sm font-medium text-[hsl(0,0%,90%)]">
                                                        {res.vehicle?.brand} {res.vehicle?.model}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-[hsl(220,10%,50%)]">
                                                {res.user ? `${res.user.prenom} ${res.user.nom}` : "Unknown User"}
                                                <br />
                                                <span className="text-xs text-[hsl(220,10%,40%)]">{res.user?.email}</span>
                                            </TableCell>
                                            <TableCell className="text-sm text-[hsl(220,10%,50%)]">
                                                {format(new Date(res.startDate), "MMM d")} -{" "}
                                                {format(new Date(res.endDate), "MMM d")}
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-[hsl(0,0%,85%)]">
                                                {res.totalPrice.toLocaleString()} MAD
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`capitalize text-xs ${statusColors[res.status] || ""}`}
                                                >
                                                    {res.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {res.status !== "pending" && res.status !== "cancelled" && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleStatusUpdate(res._id, "pending")}
                                                            className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                                                            title="Reset to Pending"
                                                        >
                                                            <RotateCcw className="h-3.5 w-3.5" />
                                                        </Button>
                                                    )}
                                                    {res.status !== "accepted" && res.status !== "cancelled" && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleStatusUpdate(res._id, "accepted")}
                                                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                                        >
                                                            <CheckCircle className="mr-1 h-3.5 w-3.5" />
                                                            Accept
                                                        </Button>
                                                    )}
                                                    {res.status !== "refused" && res.status !== "cancelled" && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleStatusUpdate(res._id, "refused")}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        >
                                                            <XCircle className="mr-1 h-3.5 w-3.5" />
                                                            Refuse
                                                        </Button>
                                                    )}
                                                    {res.status === "cancelled" && (
                                                        <span className="text-sm text-[hsl(220,10%,35%)]">
                                                            Cancelled
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminShell>
    );
}
