import { Wallet, CheckCircle2, Clock, PieChart, Download, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Input, PageHeader, Select, StatCard, StatusBadge, Table } from "@/components/ui-kit";
import { FeeChart } from "@/components/charts";
import { feeStatus as getMockFeeStatus, students as seedStudents } from "@/data/mock";
import { api, endpoints } from "@/services/api";
import { formatDate, formatINR } from "@/utils/format";

const columns = ["Student", "Course", "Total Fee", "Paid", "Pending", "Due Date", "Status"];

function unwrapList(response, key) {
  const root = response?.data ?? response;
  const list = root?.[key] ?? root?.data?.[key];
  return Array.isArray(list) ? list : [];
}

function normalizeStudent(student) {
  const totalFee = Number(student.totalFee ?? student.fee ?? 0);
  const paid = Number(student.paid ?? student.amountPaid ?? 0);
  const pending = Math.max(0, totalFee - paid);
  const computedStatus = paid >= totalFee && totalFee > 0
    ? "Paid"
    : paid > 0
      ? "Partially Paid"
      : "Pending";

  return {
    ...student,
    id: student.id || student.studentCode || student._id || student.email || student.name,
    name: student.name || student.studentName || "Unnamed student",
    course: typeof student.course === "object" ? (student.course?.name || student.course?.courseName || "") : (student.course || ""),
    batch: typeof student.batch === "object" ? (student.batch?.name || student.batch?.batchName || "") : (student.batch || ""),
    totalFee,
    paid,
    pending,
    dueDate: student.dueDate || "",
    feeStatus: student.feeStatus || computedStatus,
  };
}

function getStatus(student) {
  if (student.feeStatus) return student.feeStatus;
  if (typeof getMockFeeStatus === "function") return getMockFeeStatus(student);
  return student.paid >= student.totalFee && student.totalFee > 0
    ? "Paid"
    : student.paid > 0
      ? "Partially Paid"
      : "Pending";
}

function downloadCsv(rows) {
  const headers = ["Student", "Course", "Batch", "Total Fee", "Paid", "Pending", "Due Date", "Status"];
  const escapeCsv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [
    headers.map(escapeCsv).join(","),
    ...rows.map((student) => [
      student.name, student.course, student.batch, student.totalFee, student.paid,
      Math.max(0, student.totalFee - student.paid), student.dueDate, getStatus(student),
    ].map(escapeCsv).join(",")),
  ].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "educentre-fees.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function FeesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [remoteStudents, setRemoteStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(endpoints.students);
      setRemoteStudents(unwrapList(response, "students").map(normalizeStudent));
    } catch (err) {
      setError(`${err.message || "Could not load fee records from the server."} Showing example data where available.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Keep all demo students visible, and prefer database records when the names match.
  const allStudents = useMemo(() => {
    const byKey = new Map();
    [...seedStudents.map(normalizeStudent), ...remoteStudents.map(normalizeStudent)].forEach((student) => {
      const key = String(student.email || student.id || student.name).trim().toLowerCase();
      byKey.set(key, student);
    });
    return [...byKey.values()];
  }, [remoteStudents]);

  const rows = useMemo(() => allStudents.filter((student) => {
    const search = query.trim().toLowerCase();
    const matchesQuery = !search || [student.name, student.course, student.batch, student.email]
      .some((value) => String(value || "").toLowerCase().includes(search));
    const matchesStatus = status === "all" || getStatus(student) === status;
    return matchesQuery && matchesStatus;
  }), [allStudents, query, status]);

  const totals = useMemo(() => allStudents.reduce((acc, student) => {
    const totalFee = Number(student.totalFee) || 0;
    const paid = Number(student.paid) || 0;
    acc.total += totalFee;
    acc.paid += paid;
    acc.pending += Math.max(0, totalFee - paid);
    if (getStatus(student) === "Partially Paid") acc.partial += 1;
    return acc;
  }, { total: 0, paid: 0, pending: 0, partial: 0 }), [allStudents]);

  function renderCell(student, column) {
    switch (column) {
      case "Student":
        return <span className="block"><span className="block font-semibold">{student.name}</span><span className="block text-xs text-muted-foreground">{student.batch || "No batch"}</span></span>;
      case "Course": return student.course || "—";
      case "Total Fee": return formatINR(student.totalFee);
      case "Paid": return <span className="font-semibold text-success">{formatINR(student.paid)}</span>;
      case "Pending": return <span className="font-semibold text-destructive">{formatINR(Math.max(0, student.totalFee - student.paid))}</span>;
      case "Due Date": return student.dueDate ? formatDate(student.dueDate) : "—";
      default: return <StatusBadge status={getStatus(student)} />;
    }
  }

  return (
    <>
      <PageHeader
        title="Fee Management"
        subtitle="Track student fees, collections, pending dues and payment status"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => { downloadCsv(rows); setNotice("Fee report exported."); }}>
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm" variant="outline" onClick={loadData} disabled={loading}>
              <RefreshCw className="size-4" /> Refresh
            </Button>
          </div>
        }
      />

      {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {notice && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
      {loading && <p className="mb-3 text-sm text-muted-foreground">Loading student fee records…</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Fees" value={formatINR(totals.total)} icon={Wallet} />
        <StatCard label="Collected" value={formatINR(totals.paid)} icon={CheckCircle2} trend={totals.total ? `${Math.round((totals.paid / totals.total) * 100)}% collected` : "No fees yet"} />
        <StatCard label="Pending" value={formatINR(totals.pending)} icon={Clock} trend="Follow up needed" trendTone="danger" />
        <StatCard label="Partially Paid" value={String(totals.partial)} icon={PieChart} />
      </div>

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <Input id="fee-search" placeholder="Search by student, course or batch" value={query} onChange={(event) => setQuery(event.target.value)} />
          <Select id="fee-status" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partially Paid">Partially Paid</option>
          </Select>
        </div>
      </Card>

      <Card className="p-0">
        <Table columns={columns} rows={rows} renderCell={renderCell} emptyMessage="No fee records match" />
      </Card>

      <Card className="p-5">
        <h3 className="text-[17px] font-bold tracking-tight">Collection trend</h3>
        <div className="mt-4"><FeeChart /></div>
      </Card>
    </>
  );
}
