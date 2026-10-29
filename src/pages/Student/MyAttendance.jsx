import { CalendarCheck, CheckCircle2, XCircle } from "lucide-react";
import { AttendanceChart } from "@/components/charts";
import { Card, ChartCard, PageHeader, StatCard, StatusBadge, Table } from "@/components/ui-kit";
import { currentStudent, studentAttendanceLog } from "@/data/mock";
import { formatDate } from "@/utils/format";

const columns = ["Date", "Subject", "Status"];

export default function MyAttendance() {
  const present = studentAttendanceLog.filter((entry) => entry.status === "Present").length;

  function renderCell(row, column) {
    if (column === "Date") return formatDate(row.date);
    if (column === "Subject") return <span className="font-semibold">{row.subject}</span>;
    return <StatusBadge status={row.status} />;
  }

  return (
    <>
      <PageHeader title="My Attendance" subtitle="Class-wise attendance record" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Overall attendance" value={`${currentStudent.attendance}%`} icon={CalendarCheck} />
        <StatCard label="Classes attended" value={String(present)} icon={CheckCircle2} />
        <StatCard
          label="Classes missed"
          value={String(studentAttendanceLog.length - present)}
          icon={XCircle}
          trend="Keep it under 3"
          trendTone="danger"
        />
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[17px] font-bold tracking-tight">Attendance progress</h3>
          <span className="text-sm font-bold text-primary">{currentStudent.attendance}%</span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary" style={{ width: `${currentStudent.attendance}%` }} />
        </div>
        <p className="mt-2 text-[13px] text-muted-foreground">Minimum requirement is 75%.</p>
      </Card>

      <ChartCard title="Monthly attendance" subtitle="Your present percentage">
        <AttendanceChart />
      </ChartCard>

      <Card className="p-0">
        <div className="border-b border-border p-5">
          <h3 className="text-[17px] font-bold tracking-tight">Recent classes</h3>
        </div>
        <Table columns={columns} rows={studentAttendanceLog} renderCell={renderCell} />
      </Card>
    </>
  );
}
