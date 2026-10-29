import { Link } from "@/lib/router-compat";
import { CalendarCheck, Wallet, Layers, FileText } from "lucide-react";
import { Badge, Card, PageHeader, StatCard } from "@/components/ui-kit";
import { announcements, batches, currentStudent, feeStatus, materials } from "@/data/mock";
import { formatDate, formatINR, greeting } from "@/utils/format";

export default function StudentDashboard() {
  const batch = batches.find((item) => item.name === currentStudent.batch) ?? batches[0];
  const pending = currentStudent.totalFee - currentStudent.paid;

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${currentStudent.name.split(" ")[0]}`}
        subtitle={`${currentStudent.course} · ${currentStudent.batch}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Attendance" value={`${currentStudent.attendance}%`} icon={CalendarCheck} trend="Above centre average" />
        <StatCard label="Fee status" value={feeStatus(currentStudent)} icon={Wallet} />
        <StatCard label="Pending amount" value={formatINR(pending)} icon={Wallet} />
        <StatCard label="Study material" value={String(materials.length)} icon={FileText} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
              <Layers className="size-[18px]" />
            </span>
            <h3 className="text-[17px] font-bold tracking-tight">My batch</h3>
          </div>
          <dl className="mt-4 space-y-3 text-[14px]">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Batch</dt>
              <dd className="font-semibold">{batch.name}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Teacher</dt>
              <dd className="font-semibold">{batch.teacher}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Timing</dt>
              <dd className="font-semibold">{batch.timing}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Room</dt>
              <dd className="font-semibold">{batch.room}</dd>
            </div>
          </dl>
          <Link to="/student/batch" className="mt-5 inline-block text-[13px] font-semibold text-primary hover:underline">
            View batch details
          </Link>
        </Card>

        <Card className="p-5 xl:col-span-2">
          <h3 className="text-[17px] font-bold tracking-tight">Latest announcements</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
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
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="text-[17px] font-bold tracking-tight">Recent study material</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {materials.slice(0, 3).map((item) => (
            <li key={item.id} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="primary">{item.type}</Badge>
                <span className="text-xs text-muted-foreground">{formatDate(item.uploadedDate)}</span>
              </div>
              <p className="mt-2.5 text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.subject}</p>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
