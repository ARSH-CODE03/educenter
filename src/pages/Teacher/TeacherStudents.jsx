import { Search, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Card,
  Input,
  PageHeader,
  Select,
  Table,
  Button,
} from "@/components/ui-kit";
import { api } from "@/services/api";

const columns = ["Student", "Contact", "Batch", "Attendance", "Course"];

function extractList(response, key) {
  const payload = response?.data ?? response;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
}

function getBatchValue(student) {
  const value = student.batch ?? student.batchName ?? student.batchCode ?? "";

  if (typeof value === "object" && value !== null) {
    return value.name ?? value.batchCode ?? value.id ?? "";
  }

  return String(value);
}

function getAttendance(student) {
  const value =
    student.attendancePercentage ??
    student.attendancePercent ??
    student.attendance;

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return null;
}

export default function TeacherStudents() {
  const [query, setQuery] = useState("");
  const [batch, setBatch] = useState("all");
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [batchResponse, studentResponse] = await Promise.all([
        api.get("/batches/my"),
        api.get("/students"),
      ]);

      const batchList = extractList(batchResponse, "batches");
      const studentList = extractList(studentResponse, "students");

      setBatches(batchList);

      // Only display students belonging to this teacher's assigned batches.
      const assignedBatchNames = new Set(
        batchList.flatMap((item) =>
          [item.name, item.batchName, item.batchCode, item.id]
            .filter(Boolean)
            .map((value) => String(value).trim().toLowerCase())
        )
      );

      const filteredStudents = studentList.filter((student) => {
        const studentBatch = getBatchValue(student).trim().toLowerCase();
        return studentBatch && assignedBatchNames.has(studentBatch);
      });

      setStudents(filteredStudents);
    } catch (err) {
      setError(
        err?.message || "Unable to load your students. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const rows = useMemo(() => {
    const search = query.trim().toLowerCase();

    return students.filter((student) => {
      const name = String(student.name ?? "").toLowerCase();
      const email = String(student.email ?? "").toLowerCase();
      const contact = String(student.contact ?? student.phone ?? "").toLowerCase();
      const studentBatch = getBatchValue(student);
      const course =
        typeof student.course === "object"
          ? student.course?.name ?? student.course?.title ?? ""
          : String(student.course ?? "");

      const matchesQuery =
        !search ||
        name.includes(search) ||
        email.includes(search) ||
        contact.includes(search);

      const matchesBatch =
        batch === "all" || studentBatch === batch;

      return matchesQuery && matchesBatch;
    });
  }, [students, query, batch]);

  function renderCell(student, column) {
    const studentBatch = getBatchValue(student);
    const attendance = getAttendance(student);

    switch (column) {
      case "Student":
        return (
          <span className="block">
            <span className="block font-semibold">{student.name || "—"}</span>
            <span className="block text-xs text-muted-foreground">
              {student.studentCode || student.id || student._id || ""}
            </span>
          </span>
        );

      case "Contact":
        return student.contact || student.phone || student.email || "—";

      case "Batch":
        return <Badge>{studentBatch || "—"}</Badge>;

      case "Attendance":
        return attendance === null ? (
          <span className="text-muted-foreground">Not available</span>
        ) : (
          <Badge variant={attendance >= 85 ? "success" : "warning"}>
            {attendance}%
          </Badge>
        );

      case "Course":
        return typeof student.course === "object"
          ? student.course?.name || student.course?.title || "—"
          : student.course || "—";

      default:
        return "—";
    }
  }

  return (
    <>
      <PageHeader
        title="Students"
        subtitle="Students enrolled in your assigned batches"
      />

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <Input
            id="ts-search"
            icon={Search}
            placeholder="Search students"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <Select
            id="ts-batch"
            value={batch}
            onChange={(event) => setBatch(event.target.value)}
          >
            <option value="all">All my batches</option>
            {batches.map((item) => (
              <option
                key={item.id || item.batchCode || item._id}
                value={item.name || item.batchName || item.batchCode || item.id}
              >
                {item.name || item.batchName || item.batchCode || item.id}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {error && (
        <Card className="mt-4 p-5">
          <p className="text-sm text-red-600">{error}</p>
          <Button
            type="button"
            variant="secondary"
            className="mt-3"
            onClick={loadData}
          >
            <RefreshCw className="mr-2 size-4" />
            Try again
          </Button>
        </Card>
      )}

      {!error && loading && (
        <Card className="mt-4 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Loading your students...
          </p>
        </Card>
      )}

      {!loading && !error && (
        <Card className="mt-4 p-0">
          {rows.length > 0 ? (
            <Table columns={columns} rows={rows} renderCell={renderCell} />
          ) : (
            <div className="p-8 text-center">
              <h3 className="font-semibold">No students found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Students assigned to your batches will appear here.
              </p>
            </div>
          )}
        </Card>
      )}
    </>
  );
}