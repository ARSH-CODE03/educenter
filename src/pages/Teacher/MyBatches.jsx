import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { Clock, MapPin, Users, RefreshCw } from "lucide-react";
import { Button, Card, PageHeader, StatusBadge } from "@/components/ui-kit";
import { api } from "@/services/api";

export default function MyBatches() {
  const [myBatches, setMyBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadMyBatches() {
    setLoading(true);
    setError("");

    try {
      // Backend should return only batches assigned to the logged-in teacher.
      const response = await api.get("/batches/my");

      const result = response?.data ?? response;
      const batchList = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.batches)
            ? result.batches
            : [];

      setMyBatches(batchList);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load your batches. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMyBatches();
  }, []);

  return (
    <>
      <PageHeader
        title="My Batches"
        subtitle="Batches assigned to you by the administrator"
      />

      {loading ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Loading your assigned batches...
          </p>
        </Card>
      ) : error ? (
        <Card className="p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
          <Button
            type="button"
            onClick={loadMyBatches}
            variant="secondary"
            className="mt-4"
          >
            <RefreshCw className="mr-2 size-4" />
            Try again
          </Button>
        </Card>
      ) : myBatches.length === 0 ? (
        <Card className="p-8 text-center">
          <Users className="mx-auto size-10 text-muted-foreground" />
          <h3 className="mt-3 font-semibold">No batches assigned yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your assigned batches will appear here when the administrator
            assigns them to you.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {myBatches.map((batch) => (
            <Card
              key={batch._id || batch.id}
              hover
              className="p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[19px] font-bold tracking-tight">
                  {batch.name || batch.batchName || "Unnamed Batch"}
                </h3>

                <StatusBadge status={batch.status || "active"} />
              </div>

              <p className="mt-1 text-[13px] text-muted-foreground">
                {typeof batch.course === "object"
                  ? batch.course?.name || batch.course?.title || "Course not specified"
                  : batch.course || "Course not specified"}
              </p>

              <ul className="mt-4 space-y-2.5 text-[13px]">
                <li className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0 text-primary" />
                  {batch.timing || batch.schedule || "Timing not specified"}
                </li>

                <li className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-primary" />
                  {batch.room || batch.location || "Room not specified"}
                </li>

                <li className="flex items-center gap-2">
                  <Users className="size-4 shrink-0 text-primary" />
                  {batch.studentsCount ??
                    batch.studentCount ??
                    (Array.isArray(batch.students)
                      ? batch.students.length
                      : 0)}{" "}
                  students
                </li>
              </ul>

              <div className="mt-5 flex gap-2">
                <Button
                  as={Link}
                  to="/teacher/attendance"
                  size="sm"
                  className="flex-1"
                >
                  Mark attendance
                </Button>

                <Button
                  as={Link}
                  to="/teacher/students"
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                >
                  Students
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}