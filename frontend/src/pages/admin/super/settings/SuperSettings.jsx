import React, { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { defaultSettings } from "@/lib/admin-mock-data";
import { Settings, Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
    const [settings, setSettings] = useState(defaultSettings);

    function handleSave() {
        toast.success("Settings saved successfully.");
    }

    return (
        <AdminShell requiredRole="admin_super">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(0,0%,96%)]">Settings</h1>
                    <p className="text-sm text-[hsl(220,10%,50%)]">
                        Configure platform-wide settings and preferences.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* General Settings */}
                    <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm font-medium text-[hsl(0,0%,85%)]">
                                <Settings className="h-4 w-4" />
                                General
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div>
                                <Label className="text-[hsl(0,0%,80%)]">Site Name</Label>
                                <Input
                                    value={settings.siteName}
                                    onChange={(e) =>
                                        setSettings({ ...settings, siteName: e.target.value })
                                    }
                                    className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)]"
                                />
                            </div>
                            <div>
                                <Label className="text-[hsl(0,0%,80%)]">Currency</Label>
                                <Input
                                    value={settings.currency}
                                    onChange={(e) =>
                                        setSettings({ ...settings, currency: e.target.value })
                                    }
                                    className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)]"
                                />
                            </div>
                            <div>
                                <Label className="text-[hsl(0,0%,80%)]">
                                    Commission Rate (%)
                                </Label>
                                <Input
                                    type="number"
                                    value={settings.commissionRate}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            commissionRate: Number(e.target.value),
                                        })
                                    }
                                    className="mt-1.5 bg-[hsl(220,20%,12%)] border-[hsl(220,14%,20%)] text-[hsl(0,0%,96%)]"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Feature Toggles */}
                    <Card className="border-[hsl(220,14%,16%)] bg-[hsl(220,20%,9%)]">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-[hsl(0,0%,85%)]">
                                Feature Toggles
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[hsl(0,0%,88%)]">
                                        Maintenance Mode
                                    </p>
                                    <p className="text-xs text-[hsl(220,10%,45%)]">
                                        Disable public access to the site.
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.maintenanceMode}
                                    onCheckedChange={(v) =>
                                        setSettings({ ...settings, maintenanceMode: v })
                                    }
                                />
                            </div>
                            <Separator className="bg-[hsl(220,14%,14%)]" />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[hsl(0,0%,88%)]">
                                        Allow New Bookings
                                    </p>
                                    <p className="text-xs text-[hsl(220,10%,45%)]">
                                        Enable or disable booking functionality.
                                    </p>
                                </div>
                                <Switch
                                    checked={settings.allowNewBookings}
                                    onCheckedChange={(v) =>
                                        setSettings({ ...settings, allowNewBookings: v })
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                    </Button>
                </div>
            </div>
        </AdminShell>
    );
}
