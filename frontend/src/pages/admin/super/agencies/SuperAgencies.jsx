import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Building2,
    Plus,
    Pencil,
    Ban,
    CheckCircle,
    MapPin,
    Search,
} from "lucide-react";
import { toast } from "sonner";

function AgencyFormDialog({
    agency,
    trigger,
    onSuccess,
}) {
    const isEdit = !!agency;
    const [name, setName] = useState(agency?.name || "");
    const [location, setLocation] = useState(agency?.location || "");
    const [open, setOpen] = useState(false);

    async function handleSave() {
        if (!name || !location) {
            toast.error("All fields are required.");
            return;
        }

        try {
            const token = localStorage.getItem("krigo_token");
            const url = isEdit
                ? `http://localhost:5000/api/agencies/${agency._id}`
                : "http://localhost:5000/api/agencies";

            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, location }), // Backend mainly uses these
            });

            if (!res.ok) throw new Error("Failed to save agency");

            toast.success(isEdit ? "Agency updated." : "Agency created.");
            setOpen(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("An error occurred.");
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="border-[hsl(220,14%,18%)] bg-[hsl(220,20%,9%)]">
                <DialogHeader>
                    <DialogTitle className="text-[hsl(0,0%,96%)]">
                        {isEdit ? "Edit Agency" : "Create Agency"}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    <div>
                        <Label className="text-[hsl(0,0%,80%)]">Agency Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="KriGo Tangier"
                            className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)]"
                        />
                    </div>
                    <div>
                        <Label className="text-[hsl(0,0%,80%)]">Location</Label>
                        <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Tangier, Morocco"
                            className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)]"
                        />
                    </div>
                    <Button className="w-full" onClick={handleSave}>
                        {isEdit ? "Save Changes" : "Create Agency"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function AgenciesPage() {
    const [agencyList, setAgencyList] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchAgencies = async () => {
        try {
            const token = localStorage.getItem("krigo_token");
            const res = await fetch("http://localhost:5000/api/agencies", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setAgencyList(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgencies();
    }, []);

    const filtered = agencyList.filter(
        (a) =>
            a.name?.toLowerCase().includes(search.toLowerCase()) ||
            a.location?.toLowerCase().includes(search.toLowerCase())
    );

    // Toggle Status is currently mostly visual or needs backend support for 'status' field update
    async function toggleStatus(id, currentStatus) {
        // Assuming backend supports status update via PUT
        try {
            const token = localStorage.getItem("krigo_token");
            const newStatus = currentStatus === "active" ? "suspended" : "active";
            const res = await fetch(`http://localhost:5000/api/agencies/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                toast.success("Agency status updated.");
                fetchAgencies();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    }

    return (
        <AdminShell requiredRole="admin_super">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[hsl(0,0%,96%)]">Agencies</h1>
                        <p className="text-sm text-[hsl(220,10%,50%)]">
                            Manage all agency accounts on the platform.
                        </p>
                    </div>
                    <AgencyFormDialog
                        onSuccess={fetchAgencies}
                        trigger={
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Agency
                            </Button>
                        }
                    />
                </div>

                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(220,10%,40%)]" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search agencies..."
                        className="pl-10 bg-[hsl(220,20%,9%)] border-[hsl(220,14%,18%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)]"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((ag) => (
                        <Card
                            key={ag._id}
                            className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10">
                                            <Building2 className="h-5 w-5 text-sky-400" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm font-semibold text-[hsl(0,0%,93%)]">
                                                {ag.name}
                                            </CardTitle>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <MapPin className="h-3 w-3 text-[hsl(220,10%,40%)]" />
                                                <span className="text-xs text-[hsl(220,10%,45%)]">
                                                    {ag.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={
                                            ag.status === "active"
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                : "bg-red-500/10 text-red-400 border-red-500/20"
                                        }
                                    >
                                        {ag.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="rounded-lg bg-[hsl(220,20%,7%)] p-2.5 text-center">
                                        <p className="text-lg font-bold text-[hsl(0,0%,90%)]">
                                            {ag.vehicleCount}
                                        </p>
                                        <p className="text-[10px] text-[hsl(220,10%,45%)]">Vehicles</p>
                                    </div>
                                    <div className="rounded-lg bg-[hsl(220,20%,7%)] p-2.5 text-center">
                                        <p className="text-lg font-bold text-[hsl(0,0%,90%)]">
                                            {ag.reservationCount}
                                        </p>
                                        <p className="text-[10px] text-[hsl(220,10%,45%)]">Bookings</p>
                                    </div>
                                    <div className="rounded-lg bg-[hsl(220,20%,7%)] p-2.5 text-center">
                                        <p className="text-lg font-bold text-[hsl(0,0%,90%)]">
                                            {(ag.revenue / 1000).toFixed(0)}k
                                        </p>
                                        <p className="text-[10px] text-[hsl(220,10%,45%)]">MAD</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <AgencyFormDialog
                                        agency={ag}
                                        onSuccess={fetchAgencies}
                                        trigger={
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 text-[hsl(220,10%,55%)] hover:bg-[hsl(220,14%,14%)] hover:text-[hsl(0,0%,85%)]"
                                            >
                                                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                                Edit
                                            </Button>
                                        }
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleStatus(ag._id, ag.status)}
                                        className={`flex-1 ${ag.status === "active"
                                            ? "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                                            : "text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                                            }`}
                                    >
                                        {ag.status === "active" ? (
                                            <>
                                                <Ban className="mr-1.5 h-3.5 w-3.5" />
                                                Suspend
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                                                Activate
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AdminShell>
    );
}
