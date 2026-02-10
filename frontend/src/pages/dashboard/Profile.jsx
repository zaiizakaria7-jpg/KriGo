import React, { useState } from "react";
import { useUserAuth } from "@/lib/user-auth-context";
import { API_URL, authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    Loader2,
    User,
    Mail,
    Shield,
    Camera,
    MapPin,
    Calendar,
    Phone,
    CheckCircle2,
    Lock,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const { user, loading, refreshUser } = useUserAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        prenom: "",
        nom: "",
        email: "",
        cin: "",
        phone: "",
        city: "",
        address: ""
    });

    const fileInputRef = React.useRef(null);

    // Avatar state
    const [avatarSeed, setAvatarSeed] = useState(user?.email || "KriGo");

    const randomizeAvatar = () => {
        const newSeed = Math.random().toString(36).substring(7);
        setAvatarSeed(newSeed);
        toast.info("Avatar style updated! Save profile to persist changes.");
    };

    React.useEffect(() => {
        if (user) {
            setFormData({
                prenom: user.prenom || "",
                nom: user.nom || "",
                email: user.email || "",
                cin: user.CIN || "",
                phone: user.phone || "",
                city: user.city || "",
                address: user.address || ""
            });
            if (user.profileImage) {
                setAvatarSeed(user.profileImage);
            } else if (!avatarSeed || avatarSeed === "KriGo") {
                setAvatarSeed(user.email);
            }
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Loading experience...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-[80vh] items-center justify-center flex-col gap-6 p-4 text-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <Lock className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Access Denied</h2>
                    <p className="text-muted-foreground mt-2 max-w-xs">Please log in to your account to view and manage your profile.</p>
                </div>
                <Button size="lg" className="px-8 rounded-full" onClick={() => window.location.href = "/login"}>Log In Now</Button>
            </div>
        );
    }

    const userName = (user.prenom || user.nom)
        ? `${user.prenom || ""} ${user.nom || ""}`.trim()
        : user.name || user.email || "User";

    const userInitials = (user.prenom || user.nom)
        ? `${(user.prenom || "")[0] || ""}${(user.nom || "")[0] || ""}`.toUpperCase()
        : (user.name || user.email || "U")[0].toUpperCase();

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("krigo_token");
            const res = await fetch(`${API_URL}/users/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    prenom: formData.prenom,
                    nom: formData.nom,
                    cin: formData.cin,
                    phone: formData.phone,
                    city: formData.city,
                    address: formData.address,
                    profileImage: avatarSeed
                })
            });

            const data = await res.json();
            if (res.ok) {
                refreshUser(data.user);
                toast.success("Profile updated successfully!");
                setIsEditing(false);
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Save Profile Error:", error);
            toast.error("An error occurred while saving profile");
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append("avatar", file);

        try {
            const token = localStorage.getItem("krigo_token");
            const res = await fetch(`${API_URL}/users/upload-avatar`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formDataUpload
            });

            const data = await res.json();
            if (res.ok) {
                setAvatarSeed(data.imageUrl);

                // Automatically save the profile with the new avatar
                const saveRes = await fetch(`${API_URL}/users/profile`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        prenom: formData.prenom || user.prenom,
                        nom: formData.nom || user.nom,
                        cin: formData.cin || user.CIN,
                        phone: formData.phone || user.phone,
                        city: formData.city || user.city,
                        address: formData.address || user.address,
                        profileImage: data.imageUrl
                    })
                });

                const saveData = await saveRes.json();
                if (saveRes.ok) {
                    refreshUser(saveData.user);
                    toast.success("Photo uploaded and saved!");
                } else {
                    toast.warning("Photo uploaded but failed to save to profile. Please click Save.");
                }
            } else {
                toast.error(data.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error(`Error uploading image: ${error.message || 'Unknown error'}`);
        } finally {
            setIsUploading(false);
        }
    };

    // --- Change Password Logic ---
    const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            toast.error("New passwords do not match");
            return;
        }
        setPasswordLoading(true);
        try {
            await authApi.changePassword({
                currentPassword: passwordData.current,
                newPassword: passwordData.new
            });
            toast.success("Password changed successfully");
            setIsPasswordOpen(false);
            setPasswordData({ current: "", new: "", confirm: "" });
        } catch (error) {
            console.error("Change Password Error:", error);
            toast.error(error.message || "Failed to change password");
        } finally {
            setPasswordLoading(false);
        }
    };

    // --- 2FA Logic ---
    const [is2FAOpen, setIs2FAOpen] = useState(false);
    const [qrData, setQrData] = useState(null); // { secret, qrCode }
    const [twoFactorCode, setTwoFactorCode] = useState("");
    const [twoFactorLoading, setTwoFactorLoading] = useState(false);
    const [passwordFor2FA, setPasswordFor2FA] = useState("");

    const handleOpen2FA = async () => {
        setIs2FAOpen(true);
        // If not enabled, generate secret immediately
        if (!user.twoFactorEnabled && !qrData) {
            setTwoFactorLoading(true);
            try {
                const data = await authApi.generate2FA();
                setQrData(data);
            } catch (error) {
                console.error("2FA Error:", error);
                toast.error(error.message || "Failed to generate 2FA QR code");
            } finally {
                setTwoFactorLoading(false);
            }
        }
    };

    const handleEnable2FA = async () => {
        setTwoFactorLoading(true);
        try {
            await authApi.enable2FA({ token: twoFactorCode });
            toast.success("Two-Factor Authentication Enabled!");
            if (refreshUser) refreshUser({ ...user, twoFactorEnabled: true });
            setIs2FAOpen(false);
            setQrData(null);
            setTwoFactorCode("");
        } catch (error) {
            toast.error(error.message || "Invalid code");
        } finally {
            setTwoFactorLoading(false);
        }
    };

    const handleDisable2FA = async () => {
        setTwoFactorLoading(true);
        try {
            await authApi.disable2FA({ password: passwordFor2FA });
            toast.success("Two-Factor Authentication Disabled");
            if (refreshUser) refreshUser({ ...user, twoFactorEnabled: false });
            setIs2FAOpen(false);
            setPasswordFor2FA("");
        } catch (error) {
            toast.error(error.message || "Failed to disable 2FA");
        } finally {
            setTwoFactorLoading(false);
        }
    };

    // --- Delete Account Logic ---
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        try {
            await authApi.deleteAccount({ password: deletePassword });
            toast.success("Account deleted successfully");
            // Logout and redirect
            localStorage.removeItem("krigo_token");
            localStorage.removeItem("krigo_user");
            window.location.href = "/login";
        } catch (error) {
            toast.error(error.message || "Failed to delete account");
            setDeleteLoading(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent pb-20">
            {/* Header / Banner Area */}
            <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-blue-600/20 to-background" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
                <div className="absolute inset-0 backdrop-blur-[2px]" />

                {/* Decoration blobs */}
                <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse" />
                <div className="absolute top-10 right-20 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />
            </div>

            <div className="mx-auto max-w-6xl px-4 lg:px-8">
                {/* Profile Header Card */}
                <div className="relative -mt-24 md:-mt-32">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 p-4 md:p-8 rounded-3xl border border-border/50 bg-card/60 dark:bg-background/60 backdrop-blur-xl shadow-xl ring-1 ring-black/5">
                        <div className="relative group">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <Avatar className="h-32 w-32 md:h-44 md:w-44 border-[6px] border-background shadow-xl rounded-full overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
                                <AvatarImage
                                    src={avatarSeed.startsWith('http') || avatarSeed.startsWith('/') ? avatarSeed : `https://api.dicebear.com/9.x/initials/svg?seed=${avatarSeed}&backgroundColor=0084ff,039be5,0288d1&backgroundType=gradientLinear&fontSize=45&chars=1`}
                                    alt={userName}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-5xl font-heading bg-primary/10 text-primary">{userInitials}</AvatarFallback>
                            </Avatar>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute bottom-2 right-2 p-2.5 rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 active:scale-95 group/cam"
                            >
                                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5 transition-transform group-hover/cam:rotate-12" />}
                            </button>
                        </div>

                        <div className="flex-1 pb-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-heading">{userName}</h1>
                                <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20">
                                    <Shield className="h-3.5 w-3.5" />
                                    {user.role || "User"}
                                </div>
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary/60" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary/60" />
                                    <span>Member since {new Date(user.createdAt || Date.now()).getFullYear()}</span>
                                </div>
                                {user.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary/60" />
                                        <span>{user.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 pb-2">
                            {!isEditing && (
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            logout();
                                            window.location.href = "/";
                                        }}
                                        className="rounded-xl border-border/50 hover:bg-red-500/5 hover:text-red-500 transition-all px-6 hidden md:flex"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log Out
                                    </Button>
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="rounded-xl shadow-lg shadow-primary/20 px-6"
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid gap-8 md:grid-cols-3">
                    {/* Left Column - Quick Stats/Info */}
                    <div className="space-y-6 animate-in slide-in-from-bottom duration-500 delay-100 fill-mode-both">
                        <Card className="rounded-2xl border border-border/50 bg-card/40 dark:bg-background/40 backdrop-blur-sm overflow-hidden group shadow-sm dark:shadow-none">
                            <CardHeader className="pb-3 border-b border-white/5 bg-muted/20">
                                <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Verification</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center justify-between group/item">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20 group-hover/item:scale-110 transition-transform">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium">Email Verified</span>
                                    </div>
                                    <div className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20 font-bold uppercase tracking-tighter">Verified</div>
                                </div>
                                <div className="flex items-center justify-between group/item opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border border-white/5">
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium">Identity Doc</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-bold tracking-tight">Verify Now</Button>
                                </div>
                                <div className="flex items-center justify-between group/item opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border border-white/5">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-medium">Phone Verified</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-bold tracking-tight">Verify Now</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border border-border/50 bg-card/40 dark:bg-background/40 backdrop-blur-sm overflow-hidden p-6 text-center shadow-sm dark:shadow-none">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">KriGo Rewards</h3>
                            <p className="text-sm text-muted-foreground mb-4">Complete your first rental to start earning points.</p>
                            <Button variant="outline" className="w-full rounded-xl border-white/10 hover:bg-primary/5 transition-colors">View Status</Button>
                        </Card>
                    </div>

                    {/* Right Column - Main Info */}
                    <div className="md:col-span-2 space-y-6 animate-in slide-in-from-bottom duration-500 delay-200 fill-mode-both">
                        <Card className="rounded-2xl border border-border/50 bg-card/40 dark:bg-background/40 backdrop-blur-sm overflow-hidden shadow-sm dark:shadow-lg border-b-4 border-b-primary/50">
                            <CardHeader className="bg-muted/20 border-b border-white/5 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">Profile Details</CardTitle>
                                        <CardDescription>Manage your personal information and account preferences.</CardDescription>
                                    </div>
                                    {isEditing && (
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="rounded-lg h-9">Cancel</Button>
                                            <Button onClick={handleSave} size="sm" className="rounded-lg h-9 bg-primary shadow-lg shadow-primary/20">Save</Button>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8 px-6 md:px-10 space-y-8 pb-10">
                                <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                                    <div className="space-y-2 group transition-all">
                                        <Label htmlFor="prenom" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ml-1">
                                            <User className="h-3 w-3 text-primary" /> First Name
                                        </Label>
                                        <Input
                                            id="prenom"
                                            value={formData.prenom}
                                            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                            disabled={!isEditing}
                                            className={cn(
                                                "h-12 px-4 rounded-xl border-white/10 transition-all",
                                                !isEditing && "bg-muted/30 border-transparent cursor-not-allowed opacity-80"
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2 group transition-all">
                                        <Label htmlFor="nom" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ml-1">
                                            <User className="h-3 w-3 text-primary" /> Last Name
                                        </Label>
                                        <Input
                                            id="nom"
                                            value={formData.nom}
                                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                            disabled={!isEditing}
                                            className={cn(
                                                "h-12 px-4 rounded-xl border-white/10 transition-all",
                                                !isEditing && "bg-muted/30 border-transparent cursor-not-allowed opacity-80"
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                                    <div className="space-y-2 group transition-all">
                                        <Label htmlFor="cin" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ml-1">
                                            <Shield className="h-3 w-3 text-primary" /> CIN / Passport
                                        </Label>
                                        <Input
                                            id="cin"
                                            value={formData.cin}
                                            onChange={(e) => setFormData({ ...formData, cin: e.target.value.toUpperCase() })}
                                            disabled={!isEditing}
                                            className={cn(
                                                "h-12 px-4 rounded-xl border-white/10 transition-all",
                                                !isEditing && "bg-muted/30 border-transparent cursor-not-allowed opacity-80"
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2 group transition-all">
                                        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ml-1">
                                            <Phone className="h-3 w-3 text-primary" /> Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            disabled={!isEditing}
                                            className={cn(
                                                "h-12 px-4 rounded-xl border-white/10 transition-all",
                                                !isEditing && "bg-muted/30 border-transparent cursor-not-allowed opacity-80"
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                                    <div className="space-y-2 group transition-all">
                                        <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ml-1">
                                            <MapPin className="h-3 w-3 text-primary" /> City
                                        </Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            disabled={!isEditing}
                                            className={cn(
                                                "h-12 px-4 rounded-xl border-white/10 transition-all",
                                                !isEditing && "bg-muted/30 border-transparent cursor-not-allowed opacity-80"
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2 group transition-all">
                                        <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ml-1">
                                            <MapPin className="h-3 w-3 text-primary" /> Address
                                        </Label>
                                        <Input
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            disabled={!isEditing}
                                            className={cn(
                                                "h-12 px-4 rounded-xl border-white/10 transition-all",
                                                !isEditing && "bg-muted/30 border-transparent cursor-not-allowed opacity-80"
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 group transition-all">
                                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ml-1">
                                        <Mail className="h-3 w-3 text-primary" /> Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        value={formData.email}
                                        disabled
                                        className="h-12 px-4 rounded-xl bg-muted/30 border-transparent cursor-not-allowed opacity-60"
                                    />
                                    <div className="flex items-center gap-2 mt-2 ml-1">
                                        <Shield className="h-3 w-3 text-primary/60" />
                                        <p className="text-[10px] text-muted-foreground font-medium italic">For security reasons, your email address is verified and permanently linked to your account.</p>
                                    </div>
                                </div>

                                <Separator className="bg-white/5 opacity-50" />

                                <div className="space-y-6">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-primary" />
                                        Account Security
                                    </h3>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Dialog open={isPasswordOpen} onOpenChange={setIsPasswordOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="rounded-xl border-white/10 hover:bg-primary/5 flex-1 h-11">
                                                    Change Password
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Change Password</DialogTitle>
                                                    <DialogDescription>
                                                        Ensure your account is using a long, random password to stay secure.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handleChangePassword} className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="current">Current Password</Label>
                                                        <Input id="current" type="password" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="new">New Password</Label>
                                                        <Input id="new" type="password" value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="confirm">Confirm Password</Label>
                                                        <Input id="confirm" type="password" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} required />
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="button" variant="ghost" onClick={() => setIsPasswordOpen(false)}>Cancel</Button>
                                                        <Button type="submit" disabled={passwordLoading}>{passwordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}</Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>

                                        <Dialog open={is2FAOpen} onOpenChange={setIs2FAOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" onClick={handleOpen2FA} className="rounded-xl border-white/10 hover:bg-primary/5 flex-1 h-11">
                                                    {user.twoFactorEnabled ? "Manage 2FA" : "Enable 2FA"}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Two-Factor Authentication</DialogTitle>
                                                    <DialogDescription>
                                                        Add an extra layer of security to your account.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                {twoFactorLoading ? (
                                                    <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                                                ) : user.twoFactorEnabled ? (
                                                    <div className="space-y-4 py-4">
                                                        <div className="flex items-center gap-2 p-3 bg-green-500/10 text-green-500 rounded-lg border border-green-500/20">
                                                            <CheckCircle2 className="h-5 w-5" />
                                                            <span className="font-semibold">2FA is currently enabled.</span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Confirm Password to Disable</Label>
                                                            <Input type="password" value={passwordFor2FA} onChange={(e) => setPasswordFor2FA(e.target.value)} placeholder="Current Password" />
                                                        </div>
                                                        <Button variant="destructive" className="w-full" onClick={handleDisable2FA} disabled={!passwordFor2FA}>Disable 2FA</Button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4 py-4">
                                                        {qrData && (
                                                            <div className="flex flex-col items-center gap-4">
                                                                <div className="bg-white p-2 rounded-lg">
                                                                    <img src={qrData.qrCode} alt="2FA QR Code" className="w-48 h-48" />
                                                                </div>
                                                                <p className="text-sm text-center text-muted-foreground">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
                                                            </div>
                                                        )}
                                                        <div className="space-y-2">
                                                            <Label>Verification Code</Label>
                                                            <Input value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} placeholder="123456" maxLength={6} className="text-center text-lg tracking-widest" />
                                                        </div>
                                                        <Button className="w-full" onClick={handleEnable2FA} disabled={twoFactorCode.length < 6}>Verify & Enable</Button>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-4">
                                    <Separator className="bg-white/5 opacity-50" />
                                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 transition-all hover:bg-red-500/10">
                                        <h4 className="text-sm font-bold text-red-400 mb-1">Danger Zone</h4>
                                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Permanently delete your account and all associated data. This action cannot be undone.</p>
                                        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10">Delete Account</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <div className="space-y-2 py-2">
                                                    <Label>Enter your password to confirm</Label>
                                                    <Input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
                                                </div>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDeleteAccount} disabled={!deletePassword || deleteLoading} className="bg-red-500 hover:bg-red-600 text-white">
                                                        {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Account"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
