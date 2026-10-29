import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  PageHeader,
  Select,
  StatusBadge,
  Table,
} from "@/components/ui-kit";
import { batches as seedBatches, courses as seedCourses, feeStatus } from "@/data/mock";
import { formatDate } from "@/utils/format";
import { api, endpoints } from "@/services/api";

const columns = ["Name", "Contact", "Course", "Batch", "Joining Date", "Fee Status", "Actions"];

const emptyForm = {
  name: "",
  contact: "",
  email: "",
  password: "",
  course: seedCourses[0]?.name || "",
  batch: seedBatches[0]?.name || "",
  joiningDate: "",
  totalFee: "",
  paid: "",
};

export default function StudentsPage() {
  const [rows, setRows] = useState([]);
  const [courses, setCourses] = useState(seedCourses);
  const [batches, setBatches] = useState(seedBatches);
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const [batch, setBatch] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [stuRes, courseRes, batchRes] = await Promise.all([
        api.get(endpoints.students),
        api.get(endpoints.courses).catch(() => null),
        api.get(endpoints.batches).catch(() => null),
      ]);
      const data = stuRes.data || stuRes;
      setRows(data.students || []);
      if (courseRes) {
        const c = (courseRes.data || courseRes).courses || [];
        if (c.length) setCourses(c);
      }
      if (batchRes) {
        const b = (batchRes.data || batchRes).batches || [];
        if (b.length) setBatches(b);
      }
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      rows.filter((student) => {
        const matchesQuery =
          student.name?.toLowerCase().includes(query.toLowerCase()) ||
          (student.contact || "").includes(query) ||
          (student.email || "").toLowerCase().includes(query.toLowerCase());
        const matchesCourse = course === "all" || student.course === course;
        const matchesBatch = batch === "all" || student.batch === batch;
        return matchesQuery && matchesCourse && matchesBatch;
      }),
    [rows, query, course, batch],
  );

  function openAdd() {
    setEditing(null);
    setForm({
      ...emptyForm,
      course: courses[0]?.name || "",
      batch: batches[0]?.name || "",
    });
    setError("");
    setModalOpen(true);
  }

  function openEdit(student) {
    setEditing(student);
    setForm({
      ...emptyForm,
      ...student,
      password: "",
      totalFee: String(student.totalFee ?? ""),
      paid: String(student.paid ?? ""),
      joiningDate: student.joiningDate || "",
    });
    setError("");
    setModalOpen(true);
  }

  function update(key) {
    return (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const email = form.email.trim().toLowerCase();
    if (!editing && !email) {
      setError("An email address is required to create the student's login account.");
      setSaving(false);
      return;
    }
    if (!editing && form.password.length < 8) {
      setError("Set a temporary password with at least 8 characters for the student login.");
      setSaving(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      contact: form.contact.trim(),
      email,
      course: form.course,
      batch: form.batch,
      joiningDate: form.joiningDate,
      totalFee: Number(form.totalFee || 0),
      paid: Number(form.paid || 0),
    };
    if (!editing) payload.password = form.password;
    else if (!email) delete payload.email;

    try {
      if (editing) {
        await api.put(`${endpoints.students}/${editing.id}`, payload);
      } else {
        await api.post(endpoints.students, payload);
      }
      setModalOpen(false);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this student? This also removes the linked login account.")) return;
    try {
      await api.del(`${endpoints.students}/${id}`);
      await load();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  }

  function renderCell(student, column) {
    switch (column) {
      case "Name":
        return (
          <span className="block">
            <span className="block font-semibold">{student.name}</span>
            <span className="block text-xs text-muted-foreground">{student.id}</span>
          </span>
        );
      case "Contact":
        return (
          <span className="block">
            <span className="block">{student.contact}</span>
            <span className="block text-xs text-muted-foreground">{student.email}</span>
          </span>
        );
      case "Course":
        return student.course;
      case "Batch":
        return <Badge>{student.batch}</Badge>;
      case "Joining Date":
        return formatDate(student.joiningDate);
      case "Fee Status":
        return <StatusBadge status={student.feeStatus || feeStatus(student)} />;
      default:
        return (
          <span className="flex gap-1.5">
            <button
              type="button"
              onClick={() => openEdit(student)}
              aria-label={`Edit ${student.name}`}
              className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-primary"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(student.id)}
              aria-label={`Delete ${student.name}`}
              className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
            </button>
          </span>
        );
    }
  }

  return (
    <>
      <PageHeader
        title="Student Management"
        subtitle={loading ? "Loading…" : `${filtered.length} of ${rows.length} students`}
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="size-4" /> Add Student
          </Button>
        }
      />

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px_220px]">
          <Input
            id="student-search"
            icon={Search}
            placeholder="Search students by name or contact"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Select id="filter-course" value={course} onChange={(event) => setCourse(event.target.value)}>
            <option value="all">All courses</option>
            {courses.map((item) => (
              <option key={item.id || item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select id="filter-batch" value={batch} onChange={(event) => setBatch(event.target.value)}>
            <option value="all">All batches</option>
            {batches.map((item) => (
              <option key={item.id || item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <Card className="p-0">
        <Table
          columns={columns}
          rows={filtered}
          renderCell={renderCell}
          emptyMessage={loading ? "Loading students…" : "No students match these filters"}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit student" : "Add student"}
        description={editing
          ? "Update the student record. Login credentials are not changed here."
          : "Create a student record and a separate secure Student login account."}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="student-form" disabled={saving}>
              {saving ? "Saving…" : editing ? "Save changes" : "Create student account"}
            </Button>
          </>
        }
      >
        <form id="student-form" className="grid gap-4 sm:grid-cols-2" onSubmit={handleSave}>
          <Input id="f-name" label="Full name" value={form.name} onChange={update("name")} required autoComplete="name" />
          <Input id="f-contact" label="Contact" value={form.contact} onChange={update("contact")} required />
          <Input id="f-email" type="email" label="Login email" value={form.email} onChange={update("email")} required={!editing} autoComplete="email" />
          {!editing && (
            <Input
              id="f-password"
              type="password"
              label="Temporary login password"
              hint="At least 8 characters. Share it securely with the student."
              value={form.password}
              onChange={update("password")}
              minLength={8}
              autoComplete="new-password"
              required
            />
          )}
          <Input id="f-join" type="date" label="Joining date" value={form.joiningDate} onChange={update("joiningDate")} required />
          <Select id="f-course" label="Course" value={form.course} onChange={update("course")} required>
            {courses.map((item) => (
              <option key={item.id || item.name} value={item.name}>{item.name}</option>
            ))}
          </Select>
          <Select id="f-batch" label="Batch" value={form.batch} onChange={update("batch")} required>
            {batches.map((item) => (
              <option key={item.id || item.name} value={item.name}>{item.name}</option>
            ))}
          </Select>
          <Input id="f-total" type="number" min="0" label="Total fee (₹)" value={form.totalFee} onChange={update("totalFee")} />
          <Input id="f-paid" type="number" min="0" label="Paid amount (₹)" value={form.paid} onChange={update("paid")} />
        </form>
      </Modal>
    </>
  );
}
