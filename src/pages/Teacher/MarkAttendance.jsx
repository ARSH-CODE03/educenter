import { Check, Save, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Button, Card, Input, PageHeader, Select } from "@/components/ui-kit";
import { batches, students } from "@/data/mock";
import { cn } from "@/lib/utils";

export default function MarkAttendance() {
  const [batch, setBatch] = useState(batches[0].name);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saved, setSaved] = useState(false);

  const roster = useMemo(() => students.filter((student) => student.batch === batch), [batch]);
  const [marks, setMarks] = useState({});

  const list = roster.length ? roster : students.slice(0, 5);
  const presentCount = list.filter((student) => (marks[student.id] ?? "Present") === "Present").length;

  function setStatus(id, status) {
    setSaved(false);
    setMarks((prev) => ({ ...prev, [id]: status }));
  }

  return (
    <>
      <PageHeader
        title="Mark Attendance"
        subtitle="Select a batch and date, then mark each student"
        actions={
          <Button
            size="sm"
            onClick={() => setSaved(true)}
          >
            <Save className="size-4" /> Save Attendance
          </Button>
        }
      />

      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-end">
          <Select id="ma-batch" label="Batch" value={batch} onChange={(event) => setBatch(event.target.value)}>
            {batches.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </Select>
          <Input id="ma-date" type="date" label="Date" value={date} onChange={(event) => setDate(event.target.value)} />
          <div className="rounded-xl border border-border bg-background px-4 py-2.5 text-[13px]">
            <span className="text-muted-foreground">Present today: </span>
            <span className="font-bold">
              {presentCount}/{list.length}
            </span>
          </div>
        </div>
      </Card>

      {saved ? (
        <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success">
          Attendance saved for {batch} on {date}.
        </div>
      ) : null}

      <Card className="p-0">
        <ul className="divide-y divide-border">
          {list.map((student) => {
            const status = marks[student.id] ?? "Present";
            return (
              <li key={student.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{student.name}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    {student.id}
                    <Badge variant={student.attendance >= 85 ? "success" : "warning"}>
                      {student.attendance}% overall
                    </Badge>
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStatus(student.id, "Present")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-semibold transition-colors",
                      status === "Present"
                        ? "border-success/40 bg-success/12 text-success"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Check className="size-3.5" /> Present
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus(student.id, "Absent")}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-semibold transition-colors",
                      status === "Absent"
                        ? "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <X className="size-3.5" /> Absent
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}
