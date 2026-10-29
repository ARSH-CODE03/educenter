import { useCallback, useEffect, useState } from "react";
import { FileText, Plus, X, RefreshCw, ExternalLink } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  Select,
} from "@/components/ui-kit";
import { api } from "@/services/api";
import { formatDate } from "@/utils/format";

const initialForm = {
  title: "",
  subject: "",
  batch: "",
  type: "Assignment",
  description: "",
  dueDate: "",
  fileUrl: "",
};

function extractMaterials(response) {
  const payload = response?.data ?? response;

  if (Array.isArray(payload?.materials)) return payload.materials;
  if (Array.isArray(payload?.data?.materials)) return payload.data.materials;
  if (Array.isArray(payload)) return payload;

  return [];
}

function extractBatches(response) {
  const payload = response?.data ?? response;

  if (Array.isArray(payload?.batches)) return payload.batches;
  if (Array.isArray(payload?.data?.batches)) return payload.data.batches;
  if (Array.isArray(payload)) return payload;

  return [];
}

export default function AssignmentsPage() {
  const [materials, setMaterials] = useState([]);
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [materialsResponse, batchesResponse] = await Promise.all([
        api.get("/materials"),
        api.get("/batches/my"),
      ]);

      setMaterials(extractMaterials(materialsResponse));
      setBatches(extractBatches(batchesResponse));
    } catch (err) {
      setError(err?.message || "Unable to load assignments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!form.title.trim() || !form.subject.trim() || !form.batch) {
      setError("Please enter the title, subject and batch.");
      return;
    }

    setSaving(true);

    try {
      await api.post("/materials", {
        title: form.title.trim(),
        subject: form.subject.trim(),
        batch: form.batch,
        type: form.type,
        description: form.description.trim(),
        dueDate: form.dueDate || null,
        fileUrl: form.fileUrl.trim(),
      });

      setForm(initialForm);
      setShowForm(false);
      setSuccessMessage("Assignment created successfully.");
      await loadData();
    } catch (err) {
      setError(err?.message || "Unable to create assignment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Assignments & Notes"
        subtitle="Share assignments and study materials with your batches"
        actions={
          <Button
            size="sm"
            onClick={() => {
              setShowForm((current) => !current);
              setError("");
              setSuccessMessage("");
            }}
          >
            {showForm ? (
              <X className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
            {showForm ? "Cancel" : "New Assignment"}
          </Button>
        }
      />

      {successMessage && (
        <Card className="mb-4 p-4">
          <p className="text-sm text-green-700">{successMessage}</p>
        </Card>
      )}

      {error && (
        <Card className="mb-4 p-4">
          <p className="text-sm text-red-600">{error}</p>
          <Button
            type="button"
            variant="secondary"
            className="mt-3"
            onClick={loadData}
          >
            <RefreshCw className="mr-2 size-4" />
            Refresh
          </Button>
        </Card>
      )}

      {showForm && (
        <Card className="mb-6 p-5">
          <h2 className="text-lg font-bold">Create Assignment</h2>
          <p className="mb-5 mt-1 text-sm text-muted-foreground">
            Complete the details to share work with your students.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                id="assignment-title"
                name="title"
                label="Assignment title *"
                placeholder="e.g. React Components"
                value={form.title}
                onChange={updateField}
                required
              />

              <Input
                id="assignment-subject"
                name="subject"
                label="Subject *"
                placeholder="e.g. Web Development"
                value={form.subject}
                onChange={updateField}
                required
              />

              <div>
                <label
                  htmlFor="assignment-batch"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Assign to batch *
                </label>

                <Select
                  id="assignment-batch"
                  name="batch"
                  value={form.batch}
                  onChange={updateField}
                  required
                >
                  <option value="">Select a batch</option>
                  {batches.map((item) => {
                    const value =
                      item.name || item.batchCode || item.id;

                    return (
                      <option
                        key={item.id || item.batchCode || item._id}
                        value={value}
                      >
                        {item.name || item.batchCode || item.id}
                      </option>
                    );
                  })}
                </Select>

                {batches.length === 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    No assigned batches found.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="assignment-type"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Material type
                </label>

                <Select
                  id="assignment-type"
                  name="type"
                  value={form.type}
                  onChange={updateField}
                >
                  <option value="Assignment">Assignment</option>
                  <option value="Notes">Notes</option>
                  <option value="Study Material">Study Material</option>
                  <option value="Homework">Homework</option>
                </Select>
              </div>

              <Input
                id="assignment-due-date"
                name="dueDate"
                label="Due date"
                type="date"
                value={form.dueDate}
                onChange={updateField}
              />

              <Input
                id="assignment-file-url"
                name="fileUrl"
                label="Attachment link"
                placeholder="https://..."
                type="url"
                value={form.fileUrl}
                onChange={updateField}
              />
            </div>

            <div>
              <label
                htmlFor="assignment-description"
                className="mb-1.5 block text-sm font-medium"
              >
                Instructions / Description
              </label>

              <textarea
                id="assignment-description"
                name="description"
                rows={4}
                value={form.description}
                onChange={updateField}
                placeholder="Write the assignment instructions here..."
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              To share a PDF or document, paste its accessible link above.
              Direct file uploads require backend file-storage support.
            </p>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={saving || batches.length === 0}>
                {saving ? "Saving..." : "Publish Assignment"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setForm(initialForm);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Loading assignments and notes...
          </p>
        </Card>
      ) : materials.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="mx-auto size-10 text-muted-foreground" />
          <h3 className="mt-3 font-semibold">No assignments yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create an assignment to share work with your students.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {materials.map((item) => (
            <Card
              key={item._id || item.id}
              hover
              className="p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-accent-foreground">
                  <FileText className="size-[18px]" />
                </span>

                <Badge variant="primary">
                  {item.type || "Assignment"}
                </Badge>
              </div>

              <h3 className="mt-4 text-[17px] font-bold leading-snug tracking-tight">
                {item.title || "Untitled"}
              </h3>

              <p className="mt-2 text-[13px] text-muted-foreground">
                {item.subject || "General"} · {item.batch || "All batches"}
              </p>

              {item.description && (
                <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}

              <p className="mt-4 text-xs text-muted-foreground">
                Shared on{" "}
                {item.uploadedDate
                  ? formatDate(item.uploadedDate)
                  : item.createdAt
                    ? formatDate(item.createdAt)
                    : "—"}
              </p>

              {item.dueDate && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Due: {formatDate(item.dueDate)}
                </p>
              )}

              {item.fileUrl && (
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <FileText className="size-4" />
                  Open attachment
                  <ExternalLink className="size-3" />
                </a>
              )}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}