import { Link } from "@/lib/router-compat";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            EduCentre helps local tuition and coaching centres move from registers, Excel sheets and
            WhatsApp groups to one organised platform.
          </p>
        </div>

        <div>
          <h3 className="text-[15px] font-bold">Platform</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link className="hover:text-foreground" to="/features">Features</Link></li>
            <li><Link className="hover:text-foreground" to="/how-it-works">How it works</Link></li>
            <li><Link className="hover:text-foreground" to="/roles">Roles</Link></li>
            <li><Link className="hover:text-foreground" to="/dashboard-preview">Dashboard preview</Link></li>
            <li><Link className="hover:text-foreground" to="/about">About</Link></li>
            <li><Link className="hover:text-foreground" to="/login">Sign in</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[15px] font-bold">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="size-4 shrink-0" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail className="size-4 shrink-0" /> hello@educentre.in</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0" /> Shop 12, Model Town, Indore</li>
            <li><Link className="font-semibold text-primary hover:underline" to="/contact">Contact page</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} EduCentre. Built for modern local coaching centres.
      </div>
    </footer>
  );
}
