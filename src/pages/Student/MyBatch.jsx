import { useCallback, useEffect, useState } from "react";
import { Clock, MapPin, User, Users, RefreshCw } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  PageHeader,
  StatusBadge,
  Table,
} from "@/components/ui-kit";
import { api } from "@/services/api";

const columns = ["Classmate", "Course", "Attendance"];

function getList(response, key) {
  const payload = response?.data ?? response;

  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  if (Array.isArray(payload)) return payload;

  return [];
}

function getBatchName(student) {
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

  return typeof value === "number" ? `${value}%` : "Not available";
}

export default function MyBatch() {
  const [batch, setBatch] = useState(null);
  const [classmates, setClassmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMyBatch = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [studentResponse, batchResponse] = await Promise.all([
        api.get("/students/me"),
        api.get("/batches/my"),
      ]);

      const studentPayload = studentResponse?.data ?? studentResponse;
      const currentStudent =
        studentPayload?.student ??
        studentPayload?.data?.student ??
        studentPayload?.data ??
        studentPayload;

      const myBatches = getList(batchResponse, "batches");

      const studentBatch = getBatchName(currentStudent);

      const matchedBatch = myBatches.find((item) => {
        const name = String(item.name ?? item.batchName ?? "");
        const code = String(item.batchCode ?? item.id ?? "");

        return (
          name === studentBatch ||
          code === studentBatch
        );
      });

      if (!matchedBatch) {
        setBatch(null);
        setClassmates([]);
        return;
      }

      setBatch(matchedBatch);

      const classmatesResponse = await api.get("/students");

      const allStudents = getList(classmatesResponse, "students");

      const currentId = String(
        currentStudent.studentCode ??
          currentStudent.id ??
          currentStudent._id ??
          ""
      );

      const currentEmail = String(currentStudent.email ?? "").toLowerCase();

      const sameBatch = allStudents.filter((student) => {
        const studentId = String(
          student.studentCode ?? student.id ?? student._id ?? ""
        );

        const sameStudent =
          (currentId && studentId === currentId) ||
          (currentEmail &&
            String(student.email ?? "").toLowerCase() === currentEmail);

        return (
          getBatchName(student) === studentBatch &&
          !sameStudent
        );
      });

      setClassmates(sameBatch);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load your batch. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyBatch();
  }, [loadMyBatch]);

  function renderCell(student, column) {
    if (column === "Classmate") {
      return (
        <span className="font-semibold">
          {student.name || "Unnamed student"}
        </span>
      );
    }

    if (column === "Course") {
      return typeof student.course === "object"
        ? student.course?.name || student.course?.title || "—"
        : student.course || "—";
    }

    return getAttendance(student);
  }

  return (
    <>
      <PageHeader
        title="My Batch"
        subtitle="Your batch details, timing and faculty"
      />

      {error && (
        <Card className="p-5">
          <p className="text-sm text-red-600">{error}</p>
          <Button
            type="button"
            variant="secondary"
            className="mt-3"
            onClick={loadMyBatch}
          >
            <RefreshCw className="mr-2 size-4" />
            Try again
          </Button>
        </Card>
      )}

      {loading ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Loading your batch...
          </p>
        </Card>
      ) : !error && !batch ? (
        <Card className="p-8 text-center">
          <Users className="mx-auto size-10 text-muted-foreground" />
          <h3 className="mt-3 font-semibold">No batch found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your batch details will appear here once your administrator
            assigns you to a batch.
          </p>
        </Card>
      ) : !error && batch ? (
        <>
          <Card className="p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between">
              <div className="min-w-0">
                <h2 className="truncate text-[24px] font-extrabold tracking-tight">
                  {batch.name || batch.batchName || "My Batch"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {typeof batch.course === "object"
                    ? batch.course?.name || batch.course?.title || "Course not specified"
                    : batch.course || "Course not specified"}
                </p>
              </div>

              <StatusBadge status={batch.status || "Active"} />
            </div>

            <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  icon: Clock,
                  label: "Timing",
                  value: batch.timing || "Not specified",
                },
                {
                  icon: User,
                  label: "Teacher",
                  value:
                    typeof batch.teacher === "object"
                      ? batch.teacher?.name || batch.teacher?.email || "Not assigned"
                      : batch.teacher || "Not assigned",
                },
                {
                  icon: MapPin,
                  label: "Room",
                  value: batch.room || "Not specified",
                },
                {
                  icon: Users,
                  label: "Classmates",
                  value: String(classmates.length + 1),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <dt className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <item.icon className="size-4 text-primary" />
                    {item.label}
                  </dt>
                  <dd className="mt-1.5 break-words text-[15px] font-semibold">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card className="p-0">
            <div className="border-b border-border p-5">
              <h3 className="text-[17px] font-bold tracking-tight">
                Classmates
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Students enrolled in your batch
              </p>
            </div>

            {classmates.length > 0 ? (
              <Table
                columns={columns}
                rows={classmates}
                renderCell={renderCell}
              />
            ) : (
              <p className="p-6 text-center text-sm text-muted-foreground">
                No other classmates found in your batch yet.
              </p>
            )}
          </Card>
        </>
      ) : null}
    </>
  );
}