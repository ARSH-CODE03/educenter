import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  CalendarCheck,
  Wallet,
  FolderOpen,
  Megaphone,
  BarChart3,
  Settings,
  Bell,
  Search,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { AttendanceChart, FeeChart } from "@/components/charts";
import { announcements, recentPayments } from "@/data/mock";
import { formatDate, formatINR } from "@/utils/format";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Students", icon: Users },
  { label: "Teachers", icon: GraduationCap },
  { label: "Courses", icon: BookOpen },
  { label: "Batches", icon: Layers },
  { label: "Attendance", icon: CalendarCheck },
  { label: "Fees", icon: Wallet },
  { label: "Study Material", icon: FolderOpen },
  { label: "Announcements", icon: Megaphone },
  { label: "Reports", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

const stats = [
  { label: "Total Students", value: "248" },
  { label: "Teachers", value: "18" },
  { label: "Active Batches", value: "12" },
  { label: "Pending Fees", value: "₹48,500" },
];

export function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-lift">
      <div className="flex">
        <aside className="hidden w-56 shrink-0 border-r border-border bg-surface p-4 lg:block">
          <Logo />
          <div className="mt-6 space-y-1">
            {items.map((item) => (
              <div
                key={item.label}
                className={
                  item.active
                    ? "flex items-center gap-2.5 rounded-lg bg-primary-soft px-2.5 py-2 text-[13px] font-semibold text-accent-foreground"
                    : "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-muted-foreground"
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </div>
            ))}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <div className="h-9 rounded-lg border border-input bg-background pl-9 pr-3 text-[13px] leading-9 text-muted-foreground">
                Search students, batches, fees…
              </div>
            </div>
            <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground">
              <Bell className="size-4" />
            </span>
            <span className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-2 py-1.5">
              <span className="grid size-7 place-items-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
                PM
              </span>
              <span className="hidden text-[12px] font-semibold sm:block">Admin</span>
            </span>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            <div>
              <h3 className="text-[22px] font-extrabold tracking-tight sm:text-[26px]">
                Good Morning, Admin
              </h3>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Here is what is happening at your centre today.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-4 shadow-soft">
                  <p className="text-[12px] font-medium text-muted-foreground">{stat.label}</p>
                  <p className="mt-1.5 text-[22px] font-extrabold tracking-tight">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
                <p className="text-[14px] font-bold">Student attendance overview</p>
                <div className="mt-3">
                  <AttendanceChart height={180} />
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
                <p className="text-[14px] font-bold">Fee collection overview</p>
                <div className="mt-3">
                  <FeeChart height={180} />
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
                <p className="text-[14px] font-bold">Recent payments</p>
                <ul className="mt-3 space-y-3">
                  {recentPayments.slice(0, 4).map((payment) => (
                    <li key={payment.id} className="flex items-center justify-between gap-3 text-[13px]">
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{payment.student}</span>
                        <span className="block text-[12px] text-muted-foreground">
                          {payment.mode} · {formatDate(payment.date)}
                        </span>
                      </span>
                      <span className="shrink-0 font-bold text-success">{formatINR(payment.amount)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
                <p className="text-[14px] font-bold">Recent announcements</p>
                <ul className="mt-3 space-y-3">
                  {announcements.slice(0, 3).map((item) => (
                    <li key={item.id} className="rounded-lg border border-border bg-background p-3">
                      <p className="text-[13px] font-semibold">{item.title}</p>
                      <p className="mt-1 line-clamp-2 text-[12px] text-muted-foreground">{item.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
