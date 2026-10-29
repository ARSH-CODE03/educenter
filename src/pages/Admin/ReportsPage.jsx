import { Download, Users, Wallet, CalendarCheck, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AttendanceChart, FeeChart, StatusPie } from "@/components/charts";
import {
  Button,
  Card,
  ChartCard,
  PageHeader,
  StatCard,
  StatusBadge,
  Table,
} from "@/components/ui-kit";
import { feeStatus, students as seedStudents } from "@/data/mock";
import { api, endpoints } from "@/services/api";
import { formatINR, formatDate } from "@/utils/format";

const columns = ["Student", "Course", "Pending", "Due Date", "Status"];

function unwrapList(response, key) {
  const root = response?.data ?? response;
  const list = root?.[key] ?? root?.data?.[key];
  return Array.isArray(list) ? list : [];
}

function normalizeStudent(student) {
  const totalFee = Number(student.totalFee ?? 0);
  const paid = Number(student.paid ?? 0);

  let calculatedStatus = "Pending";

  if (totalFee > 0 && paid >= totalFee) {
    calculatedStatus = "Paid";
  } else if (paid > 0) {
    calculatedStatus = "Partially Paid";
  }

  return {
    ...student,
    id: student.id || student.studentCode || student._id || student.email || student.name,
    name: student.name || "Unnamed student",
    course:
      typeof student.course === "object"
        ? student.course?.name || student.course?.courseName || ""
        : student.course || "",
    batch:
      typeof student.batch === "object"
        ? student.batch?.name || student.batch?.batchName || ""
        : student.batch || "",
    totalFee,
    paid,
    pending: Math.max(0, totalFee - paid),
    feeStatus: student.feeStatus || calculatedStatus,
  };
}

function getStatus(student) {
  if (student.feeStatus) return student.feeStatus;

  try {
    return feeStatus(student);
  } catch {
    return "Pending";
  }
}

function downloadCsv(students) {
  const headers = [
    "Student",
    "Course",
    "Batch",
    "Total Fee",
    "Paid",
    "Pending",
    "Due Date",
    "Fee Status",
  ];

  const escapeCsv = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const csv = [
    headers.map(escapeCsv).join(","),
    ...students.map((student) =>
      [
        student.name,
        student.course,
        student.batch,
        student.totalFee,
        student.paid,
        student.pending,
        student.dueDate,
        getStatus(student),
      ]
        .map(escapeCsv)
        .join(",")
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "educentre-report.csv";
  link.click();

  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [remoteStudents, setRemoteStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(endpoints.students);
      const list = unwrapList(response, "students");

      setRemoteStudents(list.map(normalizeStudent));
    } catch (err) {
      setError(
        `${err.message || "Could not load report data."} Showing example data where available.`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Preserve dummy data and prefer backend records when they match.
  const allStudents = useMemo(() => {
    const byKey = new Map();

    [...seedStudents.map(normalizeStudent), ...remoteStudents].forEach(
      (student) => {
        const key = String(
          student.email || student.id || student.name
        )
          .trim()
          .toLowerCase();

        byKey.set(key, student);
      }
    );

    return [...byKey.values()];
  }, [remoteStudents]);

  const totals = useMemo(() => {
    const result = {
      totalFees: 0,
      collected: 0,
      pending: 0,
      partial: 0,
      paidCount: 0,
      pendingCount: 0,
      activeStudents: allStudents.length,
    };

    allStudents.forEach((student) => {
      result.totalFees += student.totalFee;
      result.collected += student.paid;
      result.pending += student.pending;

      const currentStatus = getStatus(student);

      if (currentStatus === "Paid") {
        result.paidCount += 1;
      } else if (currentStatus === "Partially Paid") {
        result.partial += 1;
      } else {
        result.pendingCount += 1;
      }
    });

    return result;
  }, [allStudents]);

  const pendingRows = useMemo(
    () => allStudents.filter((student) => getStatus(student) !== "Paid"),
    [allStudents]
  );

  const pie = useMemo(
    () => [
      { name: "Paid", value: totals.paidCount },
      { name: "Partially Paid", value: totals.partial },
      { name: "Pending", value: totals.pendingCount },
    ],
    [totals]
  );

  function renderCell(student, column) {
    switch (column) {
      case "Student":
        return (
          <span className="block">
            <span className="block font-semibold">{student.name}</span>
            <span className="block text-xs text-muted-foreground">
              {student.batch || "No batch assigned"}
            </span>
          </span>
        );

      case "Course":
        return student.course || "—";

      case "Pending":
        return (
          <span className="font-semibold text-destructive">
            {formatINR(student.pending)}
          </span>
        );

      case "Due Date":
        return student.dueDate ? formatDate(student.dueDate) : "—";

      default:
        return <StatusBadge status={getStatus(student)} />;
    }
  }

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Attendance, fee collection and student statistics"
        actions={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => downloadCsv(allStudents)}
            >
              <Download className="size-4" />
              Download report
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCw className="size-4" />
              Refresh
            </Button>
          </div>
        }
      />

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {loading && (
        <p className="mb-3 text-sm text-muted-foreground">
          Updating report data…
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Students"
          value={String(totals.activeStudents)}
          icon={Users}
        />

        <StatCard
          label="Total Fees Collected"
          value={formatINR(totals.collected)}
          icon={Wallet}
          trend={
            totals.totalFees > 0
              ? `${Math.round(
                  (totals.collected / totals.totalFees) * 100
                )}% of total fees`
              : "No fees recorded"
          }
        />

        <StatCard
          label="Pending Fees"
          value={formatINR(totals.pending)}
          icon={CalendarCheck}
          trend="Outstanding balance"
          trendTone="danger"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Attendance report"
          subtitle="Present percentage by month"
        >
          <AttendanceChart />
        </ChartCard>

        <ChartCard
          title="Fee collection report"
          subtitle="Collected vs pending (₹)"
        >
          <FeeChart />
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartCard
          title="Fee status split"
          subtitle="Students grouped by payment status"
        >
          <StatusPie data={pie} />

          <ul className="mt-4 space-y-2 text-[13px]">
            {pie.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between"
              >
                <span className="text-muted-foreground">
                  {item.name}
                </span>
                <span className="font-semibold">
                  {item.value} students
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>

        <Card className="p-0 xl:col-span-2">
          <div className="border-b border-border p-5">
            <h3 className="text-[17px] font-bold tracking-tight">
              Pending fee report
            </h3>

            <p className="mt-1 text-[13px] text-muted-foreground">
              {pendingRows.length} students with outstanding balances
            </p>
          </div>

          <Table
            columns={columns}
            rows={pendingRows}
            renderCell={renderCell}
            emptyMessage="No pending fee records"
          />
        </Card>
      </div>
    </>
  );
}