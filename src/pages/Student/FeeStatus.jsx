import { Wallet, CheckCircle2, Clock, Download } from "lucide-react";
import { Button, Card, PageHeader, StatCard, StatusBadge, Table } from "@/components/ui-kit";
import { currentStudent, feeStatus, recentPayments } from "@/data/mock";
import { formatDate, formatINR } from "@/utils/format";

const columns = ["Receipt", "Date", "Mode", "Amount"];

export default function FeeStatus() {
  const pending = currentStudent.totalFee - currentStudent.paid;

  function renderCell(payment, column) {
    if (column === "Receipt") return <span className="font-semibold">{payment.id}</span>;
    if (column === "Date") return formatDate(payment.date);
    if (column === "Mode") return payment.mode;
    return <span className="font-semibold text-success">{formatINR(payment.amount)}</span>;
  }

  return (
    <>
      <PageHeader
        title="Fee Status"
        subtitle={`${currentStudent.course} · Due ${formatDate(currentStudent.dueDate)}`}
        actions={
          <Button size="sm" variant="secondary">
            <Download className="size-4" /> Download receipt
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total fee" value={formatINR(currentStudent.totalFee)} icon={Wallet} />
        <StatCard label="Paid" value={formatINR(currentStudent.paid)} icon={CheckCircle2} />
        <StatCard
          label="Pending"
          value={formatINR(pending)}
          icon={Clock}
          trend={pending > 0 ? "Please clear before due date" : "All clear"}
          trendTone={pending > 0 ? "danger" : "success"}
        />
      </div>

      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-[17px] font-bold tracking-tight">Current status</h3>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Payments are updated by the centre office after confirmation.
            </p>
          </div>
          <StatusBadge status={feeStatus(currentStudent)} />
        </div>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-success"
            style={{ width: `${Math.round((currentStudent.paid / currentStudent.totalFee) * 100)}%` }}
          />
        </div>
      </Card>

      <Card className="p-0">
        <div className="border-b border-border p-5">
          <h3 className="text-[17px] font-bold tracking-tight">Payment history</h3>
        </div>
        <Table columns={columns} rows={recentPayments} renderCell={renderCell} />
      </Card>
    </>
  );
}
