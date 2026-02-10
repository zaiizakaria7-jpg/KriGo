import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Car, Menu, User, LayoutDashboard, LogOut } from "lucide-react";
import { useUserAuth } from "@/lib/user-auth-context";
import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@/components/logo";

export function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [open, setOpen] = useState(false);
  const { user, logout } = useUserAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/vehicles", label: "Vehicles" },
    ...(user ? [{ href: "/dashboard", label: "My Bookings" }] : []),
  ];

  const userName = user?.prenom
    ? `${user.prenom} ${user.nom}`
    : user?.name || user?.email || "User";

  const userInitials = user?.prenom
    ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase()
    : (user?.name || user?.email || "U")[0].toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center">
          <img
            src="/logo.PNG"
            alt="KriGo Logo"
            className="h-12 w-auto object-contain transition-all mix-blend-multiply dark:invert dark:hue-rotate-[180deg] dark:contrast-[1.2] dark:brightness-[1.1] dark:mix-blend-screen"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ModeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 flex items-center justify-center hover:bg-primary/5 transition-all">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                  <Avatar className="h-9 w-9 border border-border shadow-sm">
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.email}&backgroundColor=0084ff,039be5,0288d1&backgroundType=gradientLinear&chars=1`}
                      alt={userName}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 rounded-2xl shadow-2xl border-white/5 bg-background/95 backdrop-blur-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border/50">
                      <AvatarImage
                        src={`https://api.dicebear.com/9.x/initials/svg?seed=${user.email}&backgroundColor=0084ff,039be5,0288d1&backgroundType=gradientLinear&chars=1`}
                        alt={userName}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 overflow-hidden">
                      <p className="text-sm font-bold leading-none truncate">{userName}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate uppercase tracking-tighter opacity-70">
                        {user.role || 'Member'}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <div className="flex flex-col gap-1 p-1">
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-primary/10 focus:text-primary transition-all py-2.5">
                    <Link to="/profile" className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 mr-3">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="font-medium">My Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-primary/10 focus:text-primary transition-all py-2.5">
                    <Link to="/dashboard" className="flex items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 mr-3">
                        <Car className="h-4 w-4" />
                      </div>
                      <span className="font-medium">My Bookings</span>
                    </Link>
                  </DropdownMenuItem>

                  {(user.role === 'admin' || user.role === 'super' || user.role === 'agency_admin') && (
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-primary/10 focus:text-primary transition-all py-2.5">
                      <Link to="/admin" className="flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 mr-3">
                          <LayoutDashboard className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Administration</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                </div>

                <DropdownMenuSeparator className="bg-white/5" />
                <div className="p-1">
                  <DropdownMenuItem onClick={() => { logout(); window.location.href = "/"; }} className="rounded-xl cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500 transition-all py-2.5">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-bold">Log out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="lg" asChild className="rounded-xl px-6 shadow-lg shadow-primary/20 bg-primary font-bold group">
              <Link to="/login" className="flex items-center">
                <User className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Sign In
              </Link>
            </Button>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex justify-end mb-4">
              <ModeToggle />
            </div>
            <nav className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="my-2 border-t border-border" />

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://api.dicebear.com/9.x/avataaars/svg?seed=Brian&skinColor=ffdbb4"
                        alt={userName}
                      />
                      <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button className="mt-2 w-full justify-start" variant="ghost" asChild onClick={() => setOpen(false)}>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button className="w-full justify-start text-red-500 hover:text-red-500" variant="ghost" onClick={() => { logout(); window.location.href = "/"; }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button className="mt-2" asChild>
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <User className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
