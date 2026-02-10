import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserAuth } from "@/lib/user-auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Car,
  CalendarDays,
  Users,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Shield,
  Activity,
  BarChart3,
} from "lucide-react";

const superAdminNav = [
  { href: "/admin/super", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/super/agencies", label: "Agencies", icon: Building2 },
  { href: "/admin/super/users", label: "Admin Users", icon: Users, superOnly: true },
  { href: "/admin/super/vehicles", label: "All Vehicles", icon: Car },
  { href: "/admin/super/reservations", label: "All Reservations", icon: CalendarDays },
  { href: "/admin/super/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/super/activity", label: "Activity Log", icon: Activity },
  { href: "/admin/super/settings", label: "Settings", icon: Settings, superOnly: true },
];

const agencyAdminNav = [
  { href: "/admin/agency", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/agency/vehicles", label: "My Vehicles", icon: Car },
  { href: "/admin/agency/reservations", label: "Reservations", icon: CalendarDays },
  { href: "/admin/agency/analytics", label: "Analytics", icon: BarChart3 },
];

function SidebarContent({
  collapsed,
  onToggle,
  onNavigate,
}) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { user, logout } = useUserAuth();

  const isSuperAdmin = user?.role === "super" || user?.role === "admin_super";

  const navItems = isSuperAdmin ? superAdminNav : agencyAdminNav;

  const userName = user?.prenom
    ? `${user.prenom} ${user.nom}`
    : user?.name || user?.email || "User";

  const userInitials = user?.prenom
    ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase()
    : (user?.name || user?.email || "U")[0].toUpperCase();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-[hsl(222,47%,9%)] to-[hsl(222,47%,4%)] border-r border-white/5">
      {/* Header */}
      <div className="flex h-20 items-center justify-between px-5">
        <Link
          to={isSuperAdmin ? "/admin/super" : "/admin/agency"}
          className="flex items-center gap-3 overflow-hidden group"
          onClick={onNavigate}
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-lg bg-primary/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              src="/logo.PNG"
              alt="KriGo Logo"
              className="relative h-12 w-auto shrink-0 object-contain invert hue-rotate-[180deg] contrast-[1.2] brightness-[1.1] mix-blend-screen"
            />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight font-heading">
                KriGo
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-primary/80 leading-none">
                {isSuperAdmin ? "Super Admin" : "Agency"}
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-[hsl(220,10%,50%)] hover:bg-[hsl(217,33%,14%)] hover:text-[hsl(0,0%,80%)] transition-colors"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div >

      <Separator className="bg-[hsl(217,33%,14%)]" />

      {/* Role badge */}
      {
        !collapsed && (
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 rounded-lg bg-[hsl(220,14%,12%)] px-3 py-2">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-[hsl(220,10%,55%)]">
                {isSuperAdmin ? "Super Admin" : "Agency Admin"}
              </span>
            </div>
          </div>
        )
      }

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/super" &&
              item.href !== "/admin/agency" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-[hsl(220,10%,55%)] hover:bg-[hsl(217,33%,14%)] hover:text-[hsl(0,0%,85%)]"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-4.5 w-4.5 shrink-0", collapsed && "h-5 w-5")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-[hsl(217,33%,14%)]" />

      {/* User section */}
      <div className="p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5",
            collapsed && "justify-center px-0"
          )}
        >
          <Avatar className="h-8 w-8 shrink-0 bg-[hsl(220,14%,18%)] border border-[hsl(220,14%,22%)]">
            <AvatarImage
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=Brian&skinColor=ffdbb4"
              alt={userName}
            />
            <AvatarFallback className="bg-[hsl(220,14%,18%)] text-[hsl(0,0%,80%)] text-xs font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[hsl(0,0%,90%)] truncate">
                {userName}
              </p>
              <p className="text-xs text-[hsl(220,10%,45%)] truncate">
                {user?.email}
              </p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "mt-1 w-full text-[hsl(220,10%,55%)] hover:bg-red-950/50 hover:text-red-400 transition-colors",
            collapsed && "px-0"
          )}
          size="sm"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>
    </div >
  );
}

export function AdminSidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex h-screen sticky top-0 flex-col border-r border-[hsl(220,14%,14%)] transition-all duration-200",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          onNavigate={() => { }}
        />
      </aside>

      {/* Mobile header + sheet */}
      <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-[hsl(220,14%,14%)] bg-[hsl(222,47%,7%)] px-4 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-[hsl(220,10%,55%)] hover:text-[hsl(0,0%,85%)]">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 p-0 border-[hsl(220,14%,14%)] bg-[hsl(222,47%,7%)]"
          >
            <SidebarContent
              collapsed={false}
              onToggle={() => { }}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <img
            src="/logo.PNG"
            alt="KriGo Logo"
            className="h-10 w-auto object-contain invert hue-rotate-[180deg] contrast-[1.2] brightness-[1.1] mix-blend-screen"
          />
          <span className="text-sm font-bold text-[hsl(0,0%,96%)]">KriGo</span>
        </div>
      </div>
    </>
  );
}
