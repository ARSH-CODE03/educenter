import { Link } from "@/lib/router-compat";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui-kit";
import { useAuth } from "@/hooks/useAuth";
import { roleHome } from "@/hooks/useAuth";

const links = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/features" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Roles", to: "/roles" },
  { label: "Dashboard", to: "/dashboard-preview" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "bg-secondary text-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {user ? (
            <Button as={Link} to={roleHome[user.role]} size="sm">
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button as={Link} to="/login" variant="secondary" size="sm">
                Login
              </Button>
              <Button as={Link} to="/register" size="sm">
                Get Started
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-border text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="animate-fade-in border-t border-border bg-surface px-4 pb-5 pt-3 lg:hidden">
          <nav className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex gap-2">
            <Button as={Link} to="/login" variant="secondary" className="flex-1">
              Login
            </Button>
            <Button as={Link} to="/register" className="flex-1">
              Get Started
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
