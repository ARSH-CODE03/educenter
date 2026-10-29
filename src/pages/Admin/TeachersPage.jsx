import { Plus, Search, Pencil, Mail } from "lucide-react";
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
import { batches as seedBatches } from "@/data/mock";
import { api, endpoints } from "@/services/api";

const columns = ["Teacher", "Subject", "Assigned Batches", "Contact", "Status", "Actions"];

const emptyForm = {
  name: "",
  subject: "",
  contact: "",
  email: "",
  password: "",
  batch: "",
  status: "Active",
};

function normalizeTeacher(teacher) {
  return {
    ...teacher,
    id: teacher.id || teacher._id || teacher.teacherCode || "",
    name: teacher.name || "",
    subject: teacher.subject || "",
    batches: Array.isArray(teacher.batches)
      ? teacher.batches.map((item) =>
          typeof item === "string" ? item : item?.name || item?._id || "",
        ).filter(Boolean)
      : teacher.batch
        ? [typeof teacher.batch === "string" ? teacher.batch : teacher.batch.name || ""]
        : [],
    contact: teacher.contact || "",
    email: teacher.email || "",
    status: teacher.status || "Active",
  };
}

export default function TeachersPage() {
  const [rows, setRows] = useState([]);
  const [batchOptions, setBatchOptions] = useState(seedBatches);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [teacherRes, batchRes] = await Promise.all([
        api.get(endpoints.teachers),
        api.get(endpoints.batches).catch(() => null),
      ]);
      const teacherData = teacherRes?.data || teacherRes;
      const teachers = teacherData?.teachers || [];
      setRows(teachers.map(normalizeTeacher));

      if (batchRes) {
        const batchData = batchRes?.data || batchRes;
        const serverBatches = batchData?.batches || [];
        if (serverBatches.length) {
          setBatchOptions(serverBatches.map((batch) => ({
            ...batch,
            id: batch.id || batch._id || batch.name,
            name: batch.name || batch.title || "",
          })).filter((batch) => batch.name));
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load teachers from the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return rows.filter((teacher) =>
      teacher.name.toLowerCase().includes(normalizedQuery) ||
      teacher.subject.toLowerCase().includes(normalizedQuery) ||
      teacher.email.toLowerCase().includes(normalizedQuery)
    );
  }, [rows, query]);

  function update(key) {
    return (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  }

  function openAdd() {
    setError("");
    setNotice("");
    setForm({ ...emptyForm, batch: batchOptions[0]?.name || "" });
    setOpen(true);
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      role: "teacher",
      subject: form.subject.trim(),
      batch: form.batch,
      contact: form.contact.trim(),
      title: form.subject.trim(),
      status: form.status,
    };

    try {
      // This Admin-only endpoint creates both the User login and Teacher profile.
      await api.post("/auth/users", payload);
      setOpen(false);
      setForm(emptyForm);
      setNotice("Teacher account created successfully. The teacher can now sign in with their email and password.");
      await load();
    } catch (err) {
      setError(err.message || "Failed to create teacher account.");
    } finally {
      setSaving(false);
    }
  }

  function renderCell(teacher, column) {
    switch (column) {
      case "Teacher":
        return (
          <span className="block">
            <span className="block font-semibold">{teacher.name}</span>
            <span className="block text-xs text-muted-foreground">{teacher.teacherCode || teacher.id}</span>
          </span>
        );
      case "Subject":
        return teacher.subject || "—";
      case "Assigned Batches":
        return (
          <span className="flex flex-wrap gap-1.5">
            {teacher.batches.length ? teacher.batches.map((batch) => (
              <Badge key={batch} variant="primary">{batch}</Badge>
            )) : <span className="text-muted-foreground">Not assigned</span>}
          </span>
        );
      case "Contact":
        return (
          <span className="block">
            <span className="block">{teacher.contact || "—"}</span>
            <span className="block text-xs text-muted-foreground">{teacher.email}</span>
          </span>
        );
      case "Status":
        return <StatusBadge status={teacher.status} />;
      default:
        return (
          <span className="flex gap-1.5">
            <button
              type="button"
              aria-label={`Email ${teacher.name}`}
              title={`Email ${teacher.email}`}
              onClick={() => {
                if (teacher.email) window.location.href = `mailto:${teacher.email}`;
              }}
              className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-primary"
            >
              <Mail className="size-3.5" />
            </button>
          </span>
        );
    }
  }

  return (
    <>
      <PageHeader
        title="Teacher Management"
        subtitle={loading ? "Loading teachers…" : `${filtered.length} teachers`}
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus className="size-4" /> Add Teacher
          </Button>
        }
      />

      {error && (
        <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {notice}
        </div>
      )}

      <Card className="p-4">
        <Input
          id="teacher-search"
          icon={Search}
          placeholder="Search teachers by name, subject or email"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </Card>

      <Card className="p-0">
        <Table
          columns={columns}
          rows={filtered}
          renderCell={renderCell}
          emptyMessage={loading ? "Loading teachers…" : "No teachers found"}
        />
      </Card>

      <Modal
        open={open}
        onClose={() => !saving && setOpen(false)}
        title="Add teacher"
        description="Create a teacher profile and secure login account. The record is saved to the backend."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" form="teacher-form" disabled={saving}>
              {saving ? "Creating…" : "Create teacher account"}
            </Button>
          </>
        }
      >
        <form id="teacher-form" className="grid gap-4 sm:grid-cols-2" onSubmit={handleSave}>
          <Input id="t-name" label="Full name" value={form.name} onChange={update("name")} required />
          <Input id="t-subject" label="Subject" value={form.subject} onChange={update("subject")} required />
          <Input id="t-contact" label="Contact" value={form.contact} onChange={update("contact")} required />
          <Input id="t-email" type="email" label="Email" value={form.email} onChange={update("email")} required />
          <Input id="t-password" type="password" label="Temporary login password (min. 8 characters)" value={form.password} onChange={update("password")} required />
          <Select id="t-batch" label="Assign batch" value={form.batch} onChange={update("batch")} required>
            <option value="">Select batch</option>
            {batchOptions.map((batch) => (
              <option key={batch.id || batch.name} value={batch.name}>{batch.name}</option>
            ))}
          </Select>
          <Select id="t-status" label="Status" value={form.status} onChange={update("status")}>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
          </Select>
          <p className="sm:col-span-2 text-xs text-muted-foreground">
            Share the temporary password securely with the teacher. Never reuse an administrator password.
          </p>
        </form>
      </Modal>
    </>
  );
}
