import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { Button, Card, PageHeader, StatusBadge, Table, Modal, Input, Select } from "@/components/ui-kit";
import { batches as seedBatches, courses as seedCourses, teachers as seedTeachers } from "@/data/mock";
import { api, endpoints } from "@/services/api";

const columns = ["Batch Name", "Course", "Teacher", "Timing", "Students", "Status"];
const emptyForm = {
  name: "",
  course: "",
  teacher: "",
  timing: "",
  room: "",
  status: "Active",
};

function unwrapList(response, key) {
  const root = response?.data ?? response;
  const list = root?.[key] ?? root?.data?.[key];
  return Array.isArray(list) ? list : [];
}

function normalizeBatch(batch) {
  return {
    ...batch,
    id: batch.id || batch._id || batch.batchCode || batch.name,
    name: batch.name || batch.batchName || batch.title || "Unnamed batch",
    course: typeof batch.course === "object" ? (batch.course?.name || batch.course?.courseName || "") : (batch.course || ""),
    teacher: typeof batch.teacher === "object" ? (batch.teacher?.name || batch.teacher?.fullName || "") : (batch.teacher || ""),
    timing: batch.timing || batch.time || "",
    room: batch.room || batch.roomNumber || "",
    students: Number(batch.students ?? batch.studentsCount ?? 0),
    status: batch.status || "Active",
  };
}

export default function BatchesPage() {
  const [remoteBatches, setRemoteBatches] = useState([]);
  const [remoteCourses, setRemoteCourses] = useState([]);
  const [remoteTeachers, setRemoteTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [batchResponse, courseResponse, teacherResponse] = await Promise.all([
        api.get(endpoints.batches),
        api.get(endpoints.courses),
        api.get(endpoints.teachers),
      ]);
      setRemoteBatches(unwrapList(batchResponse, "batches").map(normalizeBatch));
      setRemoteCourses(unwrapList(courseResponse, "courses"));
      setRemoteTeachers(unwrapList(teacherResponse, "teachers"));
    } catch (err) {
      setError(`${err.message || "Could not load batches from the server."} Example data is still shown.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const allBatches = useMemo(() => {
    const byName = new Map();
    [...seedBatches.map(normalizeBatch), ...remoteBatches.map(normalizeBatch)].forEach((batch) => {
      byName.set(String(batch.name).trim().toLowerCase(), batch);
    });
    return [...byName.values()];
  }, [remoteBatches]);

  const allCourses = useMemo(() => {
    const byName = new Map();
    [...seedCourses, ...remoteCourses].forEach((course) => {
      const name = course?.name || course?.courseName;
      if (name) byName.set(name.trim().toLowerCase(), { ...course, name });
    });
    return [...byName.values()];
  }, [remoteCourses]);

  const allTeachers = useMemo(() => {
    const byName = new Map();
    [...seedTeachers, ...remoteTeachers].forEach((teacher) => {
      const name = teacher?.name || teacher?.fullName;
      if (name) byName.set(name.trim().toLowerCase(), { ...teacher, name });
    });
    return [...byName.values()];
  }, [remoteTeachers]);

  async function handleCreate(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        name: form.name.trim(),
        course: form.course,
        teacher: form.teacher,
        timing: form.timing.trim(),
        room: form.room.trim(),
        status: form.status,
      };
      const response = await api.post(endpoints.batches, payload);
      const createdBatch = response?.data?.batch ?? response?.batch;
      if (createdBatch) {
        setRemoteBatches((current) => [normalizeBatch(createdBatch), ...current]);
      }
      await loadData();
      setForm(emptyForm);
      setOpen(false);
      setNotice("Batch created. It can now be selected for student enrollment.");
    } catch (err) {
      setError(`Could not create batch: ${err.message}. Check that you are logged in as Admin and the backend is running.`);
    } finally {
      setSaving(false);
    }
  }

  function renderCell(batch, column) {
    switch (column) {
      case "Batch Name":
        return <span className="block"><span className="block font-semibold">{batch.name}</span><span className="block text-xs text-muted-foreground">{batch.room || "No room assigned"}</span></span>;
      case "Course": return batch.course || "—";
      case "Teacher": return batch.teacher || "Not assigned";
      case "Timing": return batch.timing || "Not set";
      case "Students": return <span className="font-semibold">{batch.students}</span>;
      default: return <StatusBadge status={batch.status} />;
    }
  }

  return (
    <>
      <PageHeader
        title="Batch Management"
        subtitle="Create batches, assign courses and teachers, and make batches available for student enrollment."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={loadData}><RefreshCw className="size-4" /> Refresh</Button>
            <Button size="sm" onClick={() => { setError(""); setNotice(""); setOpen(true); }}>
              <Plus className="size-4" /> Create Batch
            </Button>
          </div>
        }
      />
      {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {notice && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
      {loading && <p className="mb-3 text-sm text-muted-foreground">Refreshing batches…</p>}
      <Card className="p-0">
        <Table columns={columns} rows={allBatches} renderCell={renderCell} />
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) setOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-label="Create batch" className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-background p-5 shadow-xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Create New Batch</h2>
              <button type="button" onClick={() => !saving && setOpen(false)} className="rounded-lg px-3 py-1 hover:bg-muted" aria-label="Close">✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <label className="block space-y-1.5"><span className="text-sm font-medium">Batch name</span><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Class 10 Science - Morning" /></label>
              <label className="block space-y-1.5"><span className="text-sm font-medium">Course</span><Select required value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}><option value="">Select course</option>{allCourses.map((course) => <option key={course._id || course.id || course.courseCode || course.name} value={course.name || course.courseName}>{course.name || course.courseName}</option>)}</Select></label>
              <label className="block space-y-1.5"><span className="text-sm font-medium">Assign teacher</span><Select required value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })}><option value="">Select teacher</option>{allTeachers.map((teacher) => <option key={teacher._id || teacher.id || teacher.teacherCode || teacher.name} value={teacher.name || teacher.fullName}>{teacher.name || teacher.fullName}</option>)}</Select></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5"><span className="text-sm font-medium">Timing</span><Input required value={form.timing} onChange={(e) => setForm({ ...form, timing: e.target.value })} placeholder="e.g. 9:00 AM - 10:30 AM" /></label>
                <label className="block space-y-1.5"><span className="text-sm font-medium">Room</span><Input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} placeholder="e.g. Room 2" /></label>
              </div>
              <label className="block space-y-1.5"><span className="text-sm font-medium">Status</span><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="Active">Active</option><option value="Closed">Closed</option></Select></label>
              <p className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">New batches are saved through the backend. Active batches will appear in the student enrollment batch selector if the enrollment page loads batches from this API.</p>
              <div className="flex justify-end gap-2 border-t border-border pt-4">
                <Button type="button" variant="outline" disabled={saving} onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Create Batch"}</Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
