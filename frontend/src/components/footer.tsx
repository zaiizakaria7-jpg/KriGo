import { Link } from "react-router-dom";
import { Car } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img
                src="/logo.PNG"
                alt="KriGo Logo"
                className="h-12 w-auto object-contain transition-all mix-blend-multiply dark:invert dark:hue-rotate-[180deg] dark:contrast-[1.2] dark:brightness-[1.1] dark:mix-blend-screen"
              />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground/80 font-medium">
              Your trusted vehicle rental partner in Morocco. Cars, motorcycles, and scooters at your fingertips.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-foreground/80 font-heading">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/vehicles?type=car" className="text-sm text-muted-foreground hover:text-primary">Cars</Link></li>
              <li><Link to="/vehicles?type=moto" className="text-sm text-muted-foreground hover:text-primary">Motorcycles</Link></li>
              <li><Link to="/vehicles?type=trottinette" className="text-sm text-muted-foreground hover:text-primary">Scooters</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-foreground/80 font-heading">Company</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary">Careers</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-widest text-foreground/80 font-heading">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary">Insurance</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} KriGo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
