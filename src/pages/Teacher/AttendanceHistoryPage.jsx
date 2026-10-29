import { AttendanceChart } from "@/components/charts";
import { Badge, Card, ChartCard, PageHeader, StatCard, Table } from "@/components/ui-kit";
import { attendanceHistory } from "@/data/mock";
import { formatDate } from "@/utils/format";
import { CalendarCheck, TrendingUp } from "lucide-react";

const columns = ["Date", "Batch", "Present", "Absent", "Percentage"];

export default function AttendanceHistoryPage() {
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
      <PageHeader title="Attendance History" subtitle="Previously marked classes and percentages" />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Average attendance" value="92%" icon={TrendingUp} trend="+2% vs last month" />
        <StatCard label="Classes marked" value={String(attendanceHistory.length * 4)} icon={CalendarCheck} />
      </div>

      <ChartCard title="Batch attendance trend" subtitle="Present percentage by month">
        <AttendanceChart />
      </ChartCard>

      <Card className="p-0">
        <Table columns={columns} rows={attendanceHistory} renderCell={renderCell} />
      </Card>
    </>
  );
}
