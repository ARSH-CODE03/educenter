import { Megaphone, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge, Button, Card, Input, Modal, PageHeader, Select, Textarea } from "@/components/ui-kit";
import { api, endpoints } from "@/services/api";
import { formatDate } from "@/utils/format";

const batchOptions = [
  "Batch A - Morning",
  "Batch B - Afternoon",
  "Batch C - Evening",
  "Batch D - Morning",
];

function fromApi(item) {
  return {
    id: item._id || item.id,
    title: item.title,
    message: item.content,
    audience: item.target === "Batch" ? item.batch : item.target,
    date: item.date || item.createdAt,
    author: item.createdBy || "Admin",
  };
}

export default function AnnouncementsPage({ canCreate = false, title = "Announcements", subtitle }) {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", message: "", audience: "All", date: "" });

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(endpoints.announcements);
      const items = response.data?.announcements || response.announcements || [];
      setRows(items.map(fromApi));
    } catch (err) {
      setError(err.message || "Could not load announcements. Please sign in again and retry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  function update(key) {
    return (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));
  }

  async function handleCreate(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const isBatch = batchOptions.includes(form.audience);
    const payload = {
      title: form.title.trim(),
      content: form.message.trim(),
      target: isBatch ? "Batch" : form.audience,
      ...(isBatch ? { batch: form.audience } : {}),
      ...(form.date ? { date: form.date } : {}),
    };
    try {
      await api.post(endpoints.announcements, payload);
      setOpen(false);
      setForm({ title: "", message: "", audience: "All", date: "" });
      await loadAnnouncements();
    } catch (err) {
      setError(err.message || "Could not publish announcement. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle ?? "Tests, holidays, class changes and updates"}
        actions={
          canCreate ? (
            <Button size="sm" onClick={() => { setError(""); setOpen(true); }}>
              <Plus className="size-4" /> New Announcement
            </Button>
          ) : null
        }
      />

      {error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <Card className="p-5 text-sm text-muted-foreground">Loading announcements…</Card>
      ) : rows.length === 0 ? (
        <Card className="p-5 text-sm text-muted-foreground">No announcements available for your account.</Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((item) => (
            <Card key={item.id} hover className="p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
                  <Megaphone className="size-[18px]" />
                </span>
                <span className="text-right">
                  <Badge variant="primary">{item.audience}</Badge>
                  <span className="mt-1.5 block text-xs text-muted-foreground">{formatDate(item.date)}</span>
                </span>
              </div>
              <h3 className="mt-4 text-[18px] font-bold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{item.message}</p>
              <p className="mt-4 text-xs font-medium text-muted-foreground">Posted by {item.author}</p>
            </Card>
          ))}
        </div>
      )}

      {canCreate ? (
        <Modal
          open={open}
          onClose={() => !saving && setOpen(false)}
          title="Create announcement"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" form="announcement-form" disabled={saving}>
                {saving ? "Publishing…" : "Publish"}
              </Button>
            </>
          }
        >
          <form id="announcement-form" className="grid gap-4" onSubmit={handleCreate}>
            <Input id="a-title" label="Title" value={form.title} onChange={update("title")} required maxLength={160} />
            <Textarea id="a-message" label="Message" value={form.message} onChange={update("message")} required />
            <Select id="a-audience" label="Audience" value={form.audience} onChange={update("audience")}>
              <option value="All">All</option>
              <option value="Students">Students</option>
              <option value="Teachers">Teachers</option>
              <option value="Parents">Parents</option>
              {batchOptions.map((batch) => <option key={batch} value={batch}>{batch}</option>)}
            </Select>
            <Input id="a-date" type="date" label="Date" value={form.date} onChange={update("date")} />
          </form>
        </Modal>
      ) : null}
    </>
  );
}
