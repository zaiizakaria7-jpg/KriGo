import React, { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
    Plus,
    Pencil,
    Ban,
    CheckCircle,
    Trash2,
    Shield,
    Building2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

function UserFormDialog({
    user,
    trigger,
    onSuccess,
    agencies = []
}) {
    const isEdit = !!user;
    const [name, setName] = useState(user?.name || (user?.prenom && user?.nom ? `${user.prenom} ${user.nom}` : "") || "");
    const [email, setEmail] = useState(user?.email || "");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(user?.role || "admin_agency");
    const [agencyId, setAgencyId] = useState(user?.agency || "");
    const [open, setOpen] = useState(false);

    async function handleSave() {
        if (!name || !email || (!isEdit && !password)) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            const token = localStorage.getItem("krigo_token");
            const url = isEdit
                ? `http://localhost:5000/api/users/${user._id}`
                : "http://localhost:5000/api/users";

            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    email,
                    password: password || undefined,
                    role,
                    agencyId: (role === "admin" || role === "admin_agency") ? agencyId : undefined,
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to save user");
            }

            toast.success(isEdit ? "User updated." : "User created.");
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
            <DialogContent className="border-[hsl(220,14%,18%)] bg-[hsl(220,20%,9%)]">
                <DialogHeader>
                    <DialogTitle className="text-[hsl(0,0%,96%)]">
                        {isEdit ? "Edit Admin User" : "Create Admin User"}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    <div>
                        <Label className="text-[hsl(0,0%,80%)]">Full Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name"
                            className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)]"
                        />
                    </div>
                    <div>
                        <Label className="text-[hsl(0,0%,80%)]">Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@krigo.ma"
                            className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)]"
                        />
                    </div>
                    <div>
                        <Label className="text-[hsl(0,0%,80%)]">
                            {isEdit ? "New Password (leave blank to keep)" : "Password"}
                        </Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)] placeholder:text-[hsl(220,10%,40%)]"
                        />
                    </div>
                    <div>
                        <Label className="text-[hsl(0,0%,80%)]">Role</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-[hsl(220,14%,18%)] bg-[hsl(220,20%,12%)]">
                                <SelectItem value="admin_super" className="text-[hsl(0,0%,90%)]">
                                    Super Admin
                                </SelectItem>
                                <SelectItem value="admin_agency" className="text-[hsl(0,0%,90%)]">
                                    Agency Admin
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {(role === "admin" || role === "admin_agency") && (
                        <div>
                            <Label className="text-[hsl(0,0%,80%)]">Assign Agency</Label>
                            <Select value={agencyId || ""} onValueChange={setAgencyId}>
                                <SelectTrigger className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)]">
                                    <SelectValue placeholder="Select agency" />
                                </SelectTrigger>
                                <SelectContent className="border-[hsl(220,14%,18%)] bg-[hsl(220,20%,12%)]">
                                    {agencies.map((ag) => (
                                        <SelectItem
                                            key={ag._id}
                                            value={ag._id}
                                            className="text-[hsl(0,0%,90%)]"
                                        >
                                            {ag.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <Button className="w-full" onClick={handleSave}>
                        {isEdit ? "Save Changes" : "Create User"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [agencies, setAgencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("admins"); // 'admins' or 'customers'

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("krigo_token");
            const [usersRes, agenciesRes] = await Promise.all([
                fetch("http://localhost:5000/api/users", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("http://localhost:5000/api/agencies", { headers: { Authorization: `Bearer ${token}` } })
            ]);

            if (usersRes.ok) setUsers(await usersRes.json());
            if (agenciesRes.ok) setAgencies(await agenciesRes.json());

        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredUsers = users.filter((u) => {
        const isAdmin = ["super", "admin", "admin_super", "admin_agency"].includes(u.role);
        return activeTab === "admins" ? isAdmin : !isAdmin;
    });

    async function toggleStatus(id, currentStatus) {
        // Placeholder for status update if backend supports it
        try {
            const token = localStorage.getItem("krigo_token");
            // Assuming we use updateUser route for this
            const res = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: currentStatus === "active" ? "suspended" : "active" }), // Ensure backend handles 'status'
            });
            if (res.ok) {
                toast.success("User status updated.");
                fetchData();
            }
        } catch (e) { toast.error("Failed to update status"); }
    }

    async function handleDelete(id) {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const token = localStorage.getItem("krigo_token");
            const res = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                toast.success("User deleted.");
                fetchData();
            } else {
                toast.error("Failed to delete user.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred.");
        }
    }

    function agencyName(agencyId) {
        if (!agencyId) return "--";
        // Handle both populated object or ID string
        const id = typeof agencyId === 'object' ? agencyId._id : agencyId;
        return agencies.find((a) => a._id === id)?.name || "--";
    }

    const getUserRoleName = (u) => {
        if (u.role === "super" || u.role === "admin_super") return "Super Admin";
        if (u.role === "admin" || u.role === "admin_agency") return "Agency Admin";
        return u.role || "User";
    };

    const getUserName = (u) => {
        if (u.prenom && u.nom) return `${u.prenom} ${u.nom}`;
        return u.name || "Unknown";
    };

    const getAvatarFallback = (u) => {
        const name = getUserName(u);
        return name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }

    return (
        <AdminShell requiredRole="admin_super">
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[hsl(0,0%,96%)]">
                            Admin Users
                        </h1>
                        <p className="text-sm text-[hsl(220,10%,50%)]">
                            Manage all accounts registered on the platform.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-[hsl(220,20%,12%)] p-1 rounded-lg border border-[hsl(220,14%,20%)]">
                            <button
                                onClick={() => setActiveTab("admins")}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === "admins"
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "text-[hsl(220,10%,50%)] hover:text-[hsl(0,0%,90%)]"
                                    }`}
                            >
                                Admins
                            </button>
                            <button
                                onClick={() => setActiveTab("customers")}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === "customers"
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "text-[hsl(220,10%,50%)] hover:text-[hsl(0,0%,90%)]"
                                    }`}
                            >
                                Customers
                            </button>
                        </div>
                        <UserFormDialog
                            onSuccess={fetchData}
                            agencies={agencies}
                            trigger={
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create User
                                </Button>
                            }
                        />
                    </div>
                </div>

                <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-[hsl(220,14%,14%)] hover:bg-transparent">
                                        <TableHead className="text-[hsl(220,10%,45%)]">User</TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">Role</TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">Agency</TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">Status</TableHead>
                                        <TableHead className="text-[hsl(220,10%,45%)]">Last Login</TableHead>
                                        <TableHead className="text-right text-[hsl(220,10%,45%)]">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-[hsl(220,10%,50%)]">
                                                No {activeTab} found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((u) => (
                                            <TableRow
                                                key={u._id}
                                                className="border-[hsl(220,14%,12%)] hover:bg-[hsl(220,14%,10%)]"
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 bg-[hsl(220,14%,16%)] border border-[hsl(220,14%,22%)]">
                                                            <AvatarFallback className="bg-[hsl(220,14%,16%)] text-[hsl(0,0%,80%)] text-xs">
                                                                {getAvatarFallback(u)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium text-[hsl(0,0%,90%)]">
                                                                {getUserName(u)}
                                                            </p>
                                                            <p className="text-xs text-[hsl(220,10%,45%)]">
                                                                {u.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5">
                                                        {u.role === "super" || u.role === "admin_super" ? (
                                                            <Shield className="h-3.5 w-3.5 text-amber-400" />
                                                        ) : (
                                                            <Building2 className="h-3.5 w-3.5 text-sky-400" />
                                                        )}
                                                        <span className="text-sm text-[hsl(0,0%,80%)]">
                                                            {getUserRoleName(u)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-[hsl(220,10%,50%)]">
                                                    {agencyName(u.agency)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            (u.status || "active") === "active"
                                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                                : "bg-red-500/10 text-red-400 border-red-500/20"
                                                        }
                                                    >
                                                        {u.status || "active"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {u.lastLogin ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-[hsl(0,0%,90%)]">
                                                                {format(new Date(u.lastLogin), "MMM d, yyyy")}
                                                            </span>
                                                            <span className="text-[10px] text-[hsl(220,10%,45%)]">
                                                                {format(new Date(u.lastLogin), "HH:mm")}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[hsl(220,10%,35%)]">--</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-end gap-1">
                                                        <UserFormDialog
                                                            user={u}
                                                            agencies={agencies}
                                                            onSuccess={fetchData}
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
                                                            onClick={() => toggleStatus(u._id, u.status || "active")}
                                                            className={
                                                                (u.status || "active") === "active"
                                                                    ? "text-amber-400 hover:text-amber-300"
                                                                    : "text-emerald-400 hover:text-emerald-300"
                                                            }
                                                        >
                                                            {(u.status || "active") === "active" ? (
                                                                <Ban className="h-3.5 w-3.5" />
                                                            ) : (
                                                                <CheckCircle className="h-3.5 w-3.5" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(u._id)}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminShell>
    );
}
