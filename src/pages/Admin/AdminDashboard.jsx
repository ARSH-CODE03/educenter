import { Users, GraduationCap, Layers, Wallet, ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { AttendanceChart, FeeChart } from "@/components/charts";
import { Badge, Button, Card, ChartCard, PageHeader, StatCard } from "@/components/ui-kit";
import { announcements, recentPayments, batches } from "@/data/mock";
import { formatDate, formatINR, greeting } from "@/utils/format";

export default function AdminDashboard() {
  return (
    <>
      <PageHeader
        title={`${greeting()}, Admin`}
        subtitle="Here is what is happening at your centre today."
        actions={
          <>
            <Button as={Link} to="/admin/students" variant="secondary" size="sm">
              Manage students
            </Button>
            <Button as={Link} to="/admin/announcements" size="sm">
              New announcement
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value="248" icon={Users} trend="+12 this month" />
        <StatCard label="Teachers" value="18" icon={GraduationCap} trend="+1 this month" />
        <StatCard label="Active Batches" value="12" icon={Layers} trend="2 nearly full" />
        <StatCard
          label="Pending Fees"
          value={formatINR(48500)}
          icon={Wallet}
          trend="7 students overdue"
          trendTone="danger"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Student attendance overview" subtitle="Monthly present percentage">
          <AttendanceChart />
        </ChartCard>
        <ChartCard title="Fee collection overview" subtitle="Collected vs pending (₹)">
          <FeeChart />
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard
          title="Recent payments"
          subtitle="Last 4 transactions"
          className="xl:col-span-1"
          action={
            <Link to="/admin/fees" className="text-[13px] font-semibold text-primary hover:underline">
              View all
            </Link>
          }
        >
          <ul className="space-y-3">
            {recentPayments.map((payment) => (
              <li key={payment.id} className="flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{payment.student}</span>
                  <span className="block text-xs text-muted-foreground">
                    {payment.mode} · {formatDate(payment.date)}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-bold text-success">
                  {formatINR(payment.amount)}
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>

        <ChartCard title="Recent announcements" subtitle="Shared with students and parents" className="xl:col-span-2">
          <ul className="grid gap-3 sm:grid-cols-2">
            {announcements.slice(0, 4).map((item) => (
              <li key={item.id} className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="primary">{item.audience}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(item.date)}</span>
                </div>
                <p className="mt-2.5 text-sm font-semibold">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">{item.message}</p>
              </li>
            ))}
          </ul>
        </ChartCard>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h3 className="text-[17px] font-bold tracking-tight">Today&apos;s batch schedule</h3>
          <Link to="/admin/batches" className="flex items-center gap-1 text-[13px] font-semibold text-primary">
            All batches <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {batches.map((batch) => (
            <div key={batch.id} className="rounded-xl border border-border bg-background p-4">
              <p className="text-sm font-semibold">{batch.name}</p>
              <p className="mt-1 text-[13px] text-muted-foreground">{batch.timing}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {batch.teacher} · {batch.students} students
              </p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
