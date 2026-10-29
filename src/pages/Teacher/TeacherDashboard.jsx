import { Link } from "@/lib/router-compat";
import { Layers, Users, CalendarCheck, FolderOpen } from "lucide-react";
import { AttendanceChart } from "@/components/charts";
import { Badge, Button, Card, ChartCard, PageHeader, StatCard } from "@/components/ui-kit";
import { announcements, batches, materials } from "@/data/mock";
import { formatDate, greeting } from "@/utils/format";

export default function TeacherDashboard() {
  const myBatches = batches.slice(0, 2);

  return (
    <>
      <PageHeader
        title={`${greeting()}, Rakesh`}
        subtitle="Your classes, batches and academic tasks for today."
        actions={
          <Button as={Link} to="/teacher/attendance" size="sm">
            Mark attendance
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="My Batches" value="2" icon={Layers} />
        <StatCard label="My Students" value="58" icon={Users} />
        <StatCard label="Classes this week" value="10" icon={CalendarCheck} />
        <StatCard label="Material uploaded" value={String(materials.length)} icon={FolderOpen} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard title="Attendance overview" subtitle="Your batches" className="xl:col-span-2">
          <AttendanceChart />
        </ChartCard>

        <Card className="p-5">
          <h3 className="text-[17px] font-bold tracking-tight">Today&apos;s classes</h3>
          <ul className="mt-4 space-y-3">
            {myBatches.map((batch) => (
              <li key={batch.id} className="rounded-xl border border-border bg-background p-4">
                <p className="text-sm font-semibold">{batch.name}</p>
                <p className="mt-1 text-[13px] text-muted-foreground">{batch.timing}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {batch.course} · {batch.students} students
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="text-[17px] font-bold tracking-tight">Academic announcements</h3>
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
    </>
  );
}
