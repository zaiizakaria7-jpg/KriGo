import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useUserAuth } from "@/lib/user-auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

function VehicleFormDialog({
    vehicle,
    trigger,
    agencyId,
    onSuccess
}) {
    const isEdit = !!vehicle;
    const [open, setOpen] = useState(false);

    // Form States
    const [brand, setBrand] = useState(vehicle?.brand || "");
    const [model, setModel] = useState(vehicle?.model || "");
    const [type, setType] = useState(vehicle?.type || "car");
    const [price, setPrice] = useState(vehicle?.price_per_day || "");
    const [image, setImage] = useState(vehicle?.image || "");
    const [description, setDescription] = useState(vehicle?.description || "");
    const [availability, setAvailability] = useState(vehicle?.availability ?? true);

    async function handleSave() {
        if (!brand || !model || !price || !type) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            const token = localStorage.getItem("krigo_token");
            const url = isEdit
                ? `http://localhost:5000/api/vehicles/${vehicle._id}`
                : "http://localhost:5000/api/vehicles";

            const method = isEdit ? "PUT" : "POST";

            const body = {
                brand,
                model,
                type,
                price_per_day: Number(price),
                image,
                description,
                availability,
                agency: agencyId
            };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to save vehicle");
            }

            toast.success(isEdit ? "Vehicle updated successfully." : "Vehicle added successfully.");
            setOpen(false);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto border-[hsl(220,14%,18%)] bg-[hsl(220,20%,9%)] sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-[hsl(0,0%,96%)]">
                        {isEdit ? "Edit Vehicle" : "Add New Vehicle"}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-[hsl(0,0%,80%)]">Brand</Label>
                            <Input
                                value={brand}
                                onChange={e => setBrand(e.target.value)}
                                placeholder="Mercedes"
                                className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)]"
                            />
                        </div>
                        <div>
                            <Label className="text-[hsl(0,0%,80%)]">Model</Label>
                            <Input
                                value={model}
                                onChange={e => setModel(e.target.value)}
                                placeholder="C-Class 2024"
                                className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)]"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-[hsl(0,0%,80%)]">Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="border-[hsl(220,14%,18%)] bg-[hsl(220,20%,12%)]">
                                    <SelectItem value="car" className="text-[hsl(0,0%,90%)]">
                                        Car
                                    </SelectItem>
                                    <SelectItem value="moto" className="text-[hsl(0,0%,90%)]">
                                        Motorcycle
                                    </SelectItem>
                                    <SelectItem
                                        value="trottinette"
                                        className="text-[hsl(0,0%,90%)]"
                                    >
                                        Scooter
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-[hsl(0,0%,80%)]">Price / Day (MAD)</Label>
                            <Input
                                type="number"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                placeholder="500"
                                className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)]"
                            />
                        </div>
                    </div>
                    <div>
                        <Label className="text-[hsl(0,0%,80%)]">Image URL</Label>
                        <Input
                            value={image}
                            onChange={e => setImage(e.target.value)}
                            placeholder="https://..."
                            className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)]"
                        />
                    </div>
                    <div>
                        <Label className="text-[hsl(0,0%,80%)]">Description</Label>
                        <Input
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Describe the vehicle..."
                            className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)]"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="text-[hsl(0,0%,80%)]">Available</Label>
                        <Switch
                            checked={availability}
                            onCheckedChange={setAvailability}
                        />
                    </div>
                    <Separator className="bg-[hsl(220,14%,14%)]" />
                    <Button className="w-full" onClick={handleSave}>
                        {isEdit ? "Save Changes" : "Add Vehicle"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function AgencyVehiclesPage() {
    const { user } = useUserAuth();
    const [search, setSearch] = useState("");
    const [vehicleList, setVehicleList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVehicles = async () => {
        if (!user?.agency) return;
        try {
            // Fetch vehicles filtering by current agency ID
            const res = await fetch(`http://localhost:5000/api/vehicles?agency=${user.agency}`);
            if (res.ok) {
                const data = await res.json();
                setVehicleList(data);
            }
        } catch (error) {
            console.error("Failed to fetch vehicles", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchVehicles();
        }
    }, [user]);

    const filtered = vehicleList.filter(
        (v) =>
            v.brand.toLowerCase().includes(search.toLowerCase()) ||
            v.model.toLowerCase().includes(search.toLowerCase())
    );

    async function handleDelete(id) {
        if (!confirm("Are you sure you want to delete this vehicle?")) return;

        try {
            const token = localStorage.getItem("krigo_token");
            const res = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                toast.success("Vehicle deleted.");
                fetchVehicles();
            } else {
                toast.error("Failed to delete vehicle");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred");
        }
    }

    return (
        <AdminShell requiredRole="admin_agency">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[hsl(0,0%,96%)]">
                            My Vehicles
                        </h1>
                        <p className="text-sm text-[hsl(220,10%,50%)]">
                            Manage your fleet of vehicles.
                        </p>
                    </div>
                    <VehicleFormDialog
                        agencyId={user?.agency}
                        onSuccess={fetchVehicles}
                        trigger={
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Vehicle
                            </Button>
                        }
                    />
                </div>

                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(220,10%,40%)]" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search vehicles..."
                        className="pl-10 bg-[hsl(220,20%,9%)] border-[hsl(220,14%,18%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)]"
                    />
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
                                        <TableHead className="text-[hsl(220,10%,45%)]">Type</TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">
                                            Price/Day
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
                                            <TableCell colSpan={5} className="h-24 text-center text-[hsl(220,10%,50%)]">
                                                No vehicles found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filtered.map((v) => (
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
                                                    <p className="text-sm font-medium text-[hsl(0,0%,90%)]">
                                                        {v.brand} {v.model}
                                                    </p>
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
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-1">
                                                    <VehicleFormDialog
                                                        vehicle={v}
                                                        agencyId={user?.agency}
                                                        onSuccess={fetchVehicles}
                                                        trigger={
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-[hsl(220,10%,55%)] hover:text-[hsl(0,0%,85%)]"
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                            </Button>
                                                        }
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(v._id)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
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
