import { Download, FileText, Plus, Upload, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  PageHeader,
  Select,
  Table,
} from "@/components/ui-kit";
import { api } from "@/services/api";
import { formatDate } from "@/utils/format";

const columns = [
  "Title",
  "Subject",
  "Batch",
  "Uploaded Date",
  "File Type",
  "Action",
];

const initialForm = {
  title: "",
  subject: "",
  batch: "",
  type: "PDF",
};

const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

function getList(response, key) {
  const payload = response?.data ?? response;

  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  if (Array.isArray(payload)) return payload;

  return [];
}

function getFileUrl(url) {
  if (!url) return "";

  if (/^https?:\/\//i.test(url)) return url;

  const serverBase = API_BASE.replace(/\/api\/?$/, "");
  return `${serverBase}/${url.replace(/^\/+/, "")}`;
}

export default function MaterialPage({
  canUpload = false,
  title = "Study Material",
  subtitle,
}) {
  const [rows, setRows] = useState([]);
  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const materialRequest = api.get("/materials");
      const batchRequest = api.get(
        canUpload ? "/batches" : "/batches/my"
      );

      const [materialResponse, batchResponse] = await Promise.all([
        materialRequest,
        batchRequest,
      ]);

      setRows(getList(materialResponse, "materials"));
      setBatches(getList(batchResponse, "batches"));
    } catch (err) {
      setError(err?.message || "Could not load study materials.");
    } finally {
      setLoading(false);
    }
  }, [canUpload]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function update(key) {
    return (event) => {
      setForm((previous) => ({
        ...previous,
        [key]: event.target.value,
      }));
    };
  }

  function handleFileChange(event) {
    const selected = event.target.files?.[0];

    if (!selected) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    const extensionAllowed = /\.(pdf|doc|docx|ppt|pptx)$/i.test(
      selected.name
    );

    if (
      !extensionAllowed ||
      (selected.type && !allowedTypes.includes(selected.type))
    ) {
      setError("Choose a PDF, DOC, DOCX, PPT or PPTX file.");
      event.target.value = "";
      setFile(null);
      return;
    }

    if (selected.size > 20 * 1024 * 1024) {
      setError("File size must not exceed 20 MB.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setError("");
    setFile(selected);

    if (!form.title) {
      setForm((previous) => ({
        ...previous,
        title: selected.name.replace(/\.[^.]+$/, ""),
      }));
    }
  }

  async function handleUpload(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title.trim() || !form.subject.trim() || !form.batch || !file) {
      setError("Enter the title and subject, select a batch and attach a file.");
      return;
    }

    const token = localStorage.getItem("educentre.token");

    if (!token) {
      setError("Please sign in again before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", form.title.trim());
    formData.append("subject", form.subject.trim());
    formData.append("batch", form.batch);
    formData.append("type", form.type);
    formData.append("size", `${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    setUploading(true);

    try {
      const response = await fetch(`${API_BASE}/materials/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message ||
            result.error?.message ||
            "Upload failed. Check your backend upload endpoint."
        );
      }

      setForm(initialForm);
      setFile(null);
      setOpen(false);
      setMessage("Study material uploaded successfully.");

      await loadData();
    } catch (err) {
      setError(err?.message || "Unable to upload the file.");
    } finally {
      setUploading(false);
    }
  }

  function renderCell(row, column) {
    const id = row._id || row.id;

    switch (column) {
      case "Title":
        return (
          <span className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-accent-foreground">
              <FileText className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold">{row.title}</span>
              <span className="block text-xs text-muted-foreground">
                {row.size || "File"}
              </span>
            </span>
          </span>
        );

      case "Subject":
        return row.subject || "—";

      case "Batch":
        return <Badge>{row.batch || "—"}</Badge>;

      case "Uploaded Date":
        return formatDate(row.uploadedDate || row.createdAt);

      case "File Type":
        return <Badge variant="primary">{row.type || "PDF"}</Badge>;

      default: {
        const url = getFileUrl(row.fileUrl);

        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            download
            className="inline-flex"
          >
            <Button size="sm" variant="secondary">
              <Download className="size-3.5" />
              Download
            </Button>
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">
            No file attached
          </span>
        );
      }
    }
  }

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle ?? `${rows.length} files available`}
        actions={
          canUpload ? (
            <Button
              size="sm"
              onClick={() => {
                setError("");
                setMessage("");
                setOpen(true);
              }}
            >
              <Plus className="size-4" />
              Upload Material
            </Button>
          ) : null
        }
      />

      {message && (
        <Card className="mb-4 p-4">
          <p className="text-sm text-green-700">{message}</p>
        </Card>
      )}

      {error && (
        <Card className="mb-4 p-4">
          <p className="text-sm text-red-600">{error}</p>
          <Button
            className="mt-3"
            variant="secondary"
            onClick={loadData}
          >
            Refresh
          </Button>
        </Card>
      )}

      <Card className="p-0">
        {loading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Loading study materials...
          </p>
        ) : (
          <Table
            columns={columns}
            rows={rows}
            renderCell={renderCell}
            emptyMessage="No material uploaded yet"
          />
        )}
      </Card>

      {canUpload && (
        <Modal
          open={open}
          onClose={() => {
            if (!uploading) setOpen(false);
          }}
          title="Upload study material"
          description="Attach a document and share it with the selected batch."
          footer={
            <>
              <Button
                type="button"
                variant="secondary"
                disabled={uploading}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                form="material-form"
                disabled={uploading || batches.length === 0}
              >
                <Upload className="size-4" />
                {uploading ? "Uploading..." : "Upload Material"}
              </Button>
            </>
          }
        >
          <form
            id="material-form"
            className="grid gap-4"
            onSubmit={handleUpload}
          >
            <Input
              id="m-title"
              label="Title"
              value={form.title}
              onChange={update("title")}
              required
            />

            <Input
              id="m-subject"
              label="Subject"
              value={form.subject}
              onChange={update("subject")}
              required
            />

            <Select
              id="m-batch"
              label="Batch"
              value={form.batch}
              onChange={update("batch")}
              required
            >
              <option value="">Select batch</option>
              {batches.map((batch) => {
                const batchName =
                  batch.name || batch.batchCode || batch.id;

                return (
                  <option
                    key={batch._id || batch.id || batch.batchCode}
                    value={batchName}
                  >
                    {batchName}
                  </option>
                );
              })}
            </Select>

            <Select
              id="m-type"
              label="File type"
              value={form.type}
              onChange={update("type")}
            >
              <option value="PDF">PDF</option>
              <option value="DOC">DOC</option>
              <option value="DOCX">DOCX</option>
              <option value="PPT">PPT</option>
              <option value="PPTX">PPTX</option>
            </Select>

            <div>
              <label
                htmlFor="material-file"
                className="mb-2 block text-sm font-medium"
              >
                Attach file *
              </label>

              <div className="rounded-xl border border-dashed border-border bg-secondary/50 p-5 text-center">
                {file ? (
                  <>
                    <FileText className="mx-auto size-6 text-primary" />
                    <p className="mt-2 break-all text-sm font-medium">
                      {file.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="mt-3"
                      onClick={() => setFile(null)}
                    >
                      <X className="size-4" />
                      Remove file
                    </Button>
                  </>
                ) : (
                  <>
                    <Upload className="mx-auto size-6 text-muted-foreground" />
                    <p className="mt-2 text-sm font-medium">
                      Choose a document from your device
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PDF, DOC, DOCX, PPT or PPTX · Maximum 20 MB
                    </p>
                  </>
                )}

                <input
                  id="material-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="mt-4 block w-full text-sm"
                  disabled={uploading}
                />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}