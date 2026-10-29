import { Link, useNavigate, useRouterState } from "@/lib/router-compat";
import { Bell, LogOut, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { LoadingState } from "@/components/ui-kit";
import { navigation, roleLabel } from "@/data/navigation";
import { useAuth, roleHome } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { initials } from "@/utils/format";

function SidebarNav({ items, pathname, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary-soft font-semibold text-accent-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <item.icon className="size-[18px] shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardLayout({ role, children }) {
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) navigate({ to: "/login", replace: true });
    else if (user.role !== role) navigate({ to: roleHome[user.role], replace: true });
  }, [ready, user, role, navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!ready || !user || user.role !== role) return <LoadingState label="Checking your access…" />;

  const items = navigation[role] ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-border bg-surface px-4 py-5 lg:flex">
        <Link to="/">
          <Logo />
        </Link>
        <p className="mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {roleLabel[role]} Menu
        </p>
        <div className="mt-3 flex-1 overflow-y-auto">
          <SidebarNav items={items} pathname={pathname} />
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate({ to: "/login", replace: true });
          }}
          className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-[18px]" /> Logout
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/25"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="animate-fade-in absolute inset-y-0 left-0 flex w-[272px] flex-col border-r border-border bg-surface px-4 py-5">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-5 flex-1 overflow-y-auto">
              <SidebarNav items={items} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate({ to: "/login", replace: true });
              }}
              className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive"
            >
              <LogOut className="size-[18px]" /> Logout
            </button>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[264px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="grid size-10 place-items-center rounded-xl border border-border lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search students, batches, fees…"
                className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              />
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                aria-label="Notifications"
                className="relative grid size-10 place-items-center rounded-xl border border-border text-muted-foreground hover:text-foreground"
              >
                <Bell className="size-[18px]" />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive" />
              </button>
              <div className="flex items-center gap-2.5 rounded-xl border border-border px-2 py-1.5 sm:px-3">
                <span className="grid size-8 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                  {initials(user.name)}
                </span>
                <span className="hidden min-w-0 leading-tight sm:block">
                  <span className="block truncate text-[13px] font-semibold">{user.name}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {roleLabel[role]}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl space-y-6 px-4 pb-24 pt-6 sm:px-6 lg:pb-10">{children}</main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur lg:hidden">
        <div className="flex items-stretch justify-around px-1 py-1.5">
          {items.slice(0, 5).map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[10px] font-medium",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="size-[18px]" />
                <span className="w-full truncate text-center">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
