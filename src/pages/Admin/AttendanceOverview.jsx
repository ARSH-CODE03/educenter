import { CalendarCheck, TrendingUp, UserX } from "lucide-react";
import { AttendanceChart } from "@/components/charts";
import { Badge, Card, ChartCard, PageHeader, StatCard, Table } from "@/components/ui-kit";
import { attendanceHistory, students } from "@/data/mock";
import { formatDate } from "@/utils/format";

const columns = ["Date", "Batch", "Present", "Absent", "Percentage"];

export default function AttendanceOverview() {
  const lowAttendance = students.filter((student) => student.attendance < 85);

  function renderCell(row, column) {
    switch (column) {
      case "Date":
        return formatDate(row.date);
      case "Batch":
        return <span className="font-semibold">{row.batch}</span>;
      case "Present":
        return <span className="text-success">{row.present}</span>;
      case "Absent":
        return <span className="text-destructive">{row.absent}</span>;
      default:
        return <Badge variant={row.percentage >= 90 ? "success" : "warning"}>{row.percentage}%</Badge>;
    }
  }

  return (
    <>
      <PageHeader title="Attendance Overview" subtitle="Centre-wide attendance across all batches" />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Average attendance" value="91%" icon={TrendingUp} trend="+3% vs last month" />
        <StatCard label="Classes marked (Aug)" value="46" icon={CalendarCheck} />
        <StatCard
          label="Students below 85%"
          value={String(lowAttendance.length)}
          icon={UserX}
          trend="Follow up required"
          trendTone="danger"
        />
      </div>

      <ChartCard title="Attendance trend" subtitle="Monthly present percentage">
        <AttendanceChart />
      </ChartCard>

      <Card className="p-0">
        <div className="border-b border-border p-5">
          <h3 className="text-[17px] font-bold tracking-tight">Recent attendance records</h3>
        </div>
        <Table columns={columns} rows={attendanceHistory} renderCell={renderCell} />
      </Card>

      <Card className="p-5">
        <h3 className="text-[17px] font-bold tracking-tight">Low attendance watchlist</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {lowAttendance.map((student) => (
            <li key={student.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4">
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{student.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{student.batch}</span>
              </span>
              <Badge variant="danger">{student.attendance}%</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
