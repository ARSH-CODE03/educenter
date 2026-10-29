import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Plus, Users, UserRoundPlus, RefreshCw, X } from "lucide-react";
import { courses as seedCourses, batches as seedBatches } from "@/data/mock";
import { api, endpoints } from "@/services/api";
import { formatINR } from "@/utils/format";

const emptyCourse = { name: "", duration: "", fee: "", teachers: "", status: "Active" };
const emptyEnrollment = { name: "", email: "", password: "", contact: "", course: "", batch: "", joiningDate: new Date().toISOString().slice(0, 10) };

function unwrapList(response, key) {
  const root = response?.data ?? response;
  const list = root?.[key] ?? root?.data?.[key];
  return Array.isArray(list) ? list : [];
}

function normalizeCourse(course) {
  return {
    id: course.id || course._id || course.courseCode || `LOCAL-${course.name}`,
    name: course.name || "Untitled course",
    duration: course.duration || "Not specified",
    students: Number(course.students ?? course.studentsCount ?? 0),
    teachers: Array.isArray(course.teachers) ? course.teachers : [],
    fee: Number(course.fee || 0),
    status: course.status || "Active",
  };
}

// Accept the common batch field names used by the mock data and API.
function normalizeBatch(batch) {
  const name = batch?.name ?? batch?.batchName ?? batch?.title ?? batch?.batchCode ?? "";
  return {
    ...batch,
    id: batch?.id ?? batch?._id ?? batch?.batchCode ?? name,
    name: String(name).trim(),
    course: typeof batch?.course === "object"
      ? (batch.course?.name ?? batch.course?.courseCode ?? "")
      : (batch?.course ?? ""),
  };
}

export default function CoursesPage() {
  const [remoteCourses, setRemoteCourses] = useState([]);
  const [remoteBatches, setRemoteBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [courseModal, setCourseModal] = useState(false);
  const [enrollModal, setEnrollModal] = useState(false);
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [enrollForm, setEnrollForm] = useState(emptyEnrollment);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [courseResponse, batchResponse] = await Promise.all([
        api.get(endpoints.courses),
        api.get(endpoints.batches),
      ]);
      setRemoteCourses(unwrapList(courseResponse, "courses").map(normalizeCourse));
      setRemoteBatches(unwrapList(batchResponse, "batches").map(normalizeBatch).filter((batch) => batch.name));
    } catch (err) {
      // Keep the sample data visible even when the API is unavailable.
      setError(`${err.message || "Could not connect to the server."} Showing example data where available.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Preserve all mock/demo courses and add database courses without duplicating the same course name.
  const allCourses = useMemo(() => {
    const byName = new Map();
    [...seedCourses.map(normalizeCourse), ...remoteCourses.map(normalizeCourse)].forEach((course) => {
      byName.set(course.name.trim().toLowerCase(), course);
    });
    return [...byName.values()];
  }, [remoteCourses]);

  const allBatches = useMemo(() => {
    const byName = new Map();
    [...seedBatches, ...remoteBatches]
      .map(normalizeBatch)
      .filter((batch) => batch.name)
      .forEach((batch) => byName.set(batch.name.toLowerCase(), batch));
    return [...byName.values()];
  }, [remoteBatches]);

  const activeCourses = allCourses.filter((course) => course.status === "Active");

  async function handleAddCourse(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        name: courseForm.name.trim(),
        duration: courseForm.duration.trim(),
        fee: Number(courseForm.fee) || 0,
        teachers: courseForm.teachers.split(",").map((item) => item.trim()).filter(Boolean),
        status: courseForm.status,
      };
      const response = await api.post(endpoints.courses, payload);
      const createdCourse = response?.data?.course ?? response?.course;
      if (createdCourse) setRemoteCourses((current) => [normalizeCourse(createdCourse), ...current]);
      await loadData();
      setCourseForm(emptyCourse);
      setCourseModal(false);
      setNotice("Course added successfully.");
    } catch (err) {
      setError(`Could not save course: ${err.message}. Please check that you are logged in as Admin and the backend is running.`);
    } finally {
      setSaving(false);
    }
  }

  async function handleEnroll(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      // Backend creates both the student profile and its login account.
      await api.post(endpoints.students, {
        name: enrollForm.name.trim(),
        email: enrollForm.email.trim(),
        password: enrollForm.password,
        contact: enrollForm.contact.trim(),
        course: enrollForm.course,
        batch: enrollForm.batch,
        joiningDate: enrollForm.joiningDate,
        totalFee: Number(allCourses.find((course) => course.name === enrollForm.course)?.fee) || 0,
        paid: 0,
      });
      setEnrollForm(emptyEnrollment);
      setEnrollModal(false);
      setNotice(`Enrollment saved for ${enrollForm.name.trim()}.`);
      await loadData();
    } catch (err) {
      setError(`Could not enroll student: ${err.message}. Choose a course and batch, and check that you are logged in with permission.`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">{allCourses.length} courses offered at your centre</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => { setError(""); setNotice(""); setCourseModal(true); }} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm">
            <Plus className="size-4" /> Add Course
          </button>
          <button type="button" onClick={() => { setError(""); setNotice(""); setEnrollModal(true); }} className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold">
            <UserRoundPlus className="size-4" /> Enroll Student
          </button>
          <button type="button" onClick={loadData} title="Refresh courses" className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-3 py-2.5"><RefreshCw className="size-4" /></button>
        </div>
      </div>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {notice && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
      {loading && <p className="text-sm text-muted-foreground">Refreshing courses from the database…</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {allCourses.map((course) => (
          <article key={course.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><BookOpen className="size-5" /></span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${course.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>{course.status}</span>
            </div>
            <h2 className="mt-4 text-lg font-bold tracking-tight">{course.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Duration: {course.duration}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-background p-3"><p className="text-muted-foreground">Students</p><p className="mt-1 flex items-center gap-1.5 font-bold"><Users className="size-4 text-primary" />{course.students}</p></div>
              <div className="rounded-xl border border-border bg-background p-3"><p className="text-muted-foreground">Course fee</p><p className="mt-1 font-bold">{formatINR(course.fee)}</p></div>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assigned teachers</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {course.teachers.length ? course.teachers.map((teacher) => <span key={teacher} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{teacher}</span>) : <span className="text-sm text-muted-foreground">No teachers assigned</span>}
              </div>
            </div>
            {course.status === "Active" && <button type="button" onClick={() => { setEnrollForm((prev) => ({ ...prev, course: course.name })); setError(""); setNotice(""); setEnrollModal(true); }} className="mt-5 w-full rounded-xl border border-primary/30 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">Enroll in this course</button>}
          </article>
        ))}
      </div>

      {courseModal && <Modal title="Add New Course" onClose={() => !saving && setCourseModal(false)}>
        <form onSubmit={handleAddCourse} className="space-y-4">
          <Field label="Course name"><input required value={courseForm.name} onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })} placeholder="e.g. Full Stack Web Development" className={inputClass} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Duration"><input value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} placeholder="e.g. 6 months" className={inputClass} /></Field>
            <Field label="Fee (₹)"><input type="number" min="0" value={courseForm.fee} onChange={(e) => setCourseForm({ ...courseForm, fee: e.target.value })} placeholder="25000" className={inputClass} /></Field>
          </div>
          <Field label="Teachers (comma-separated)"><input value={courseForm.teachers} onChange={(e) => setCourseForm({ ...courseForm, teachers: e.target.value })} placeholder="e.g. Rakesh Menon, Sunita Deshmukh" className={inputClass} /></Field>
          <Field label="Status"><select value={courseForm.status} onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })} className={inputClass}><option>Active</option><option>Closed</option></select></Field>
          <ModalActions saving={saving} submitLabel="Save Course" onCancel={() => setCourseModal(false)} />
        </form>
      </Modal>}

      {enrollModal && <Modal title="Enroll Student in a Course" onClose={() => !saving && setEnrollModal(false)}>
        <form onSubmit={handleEnroll} className="space-y-4">
          <Field label="Student name"><input required value={enrollForm.name} onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })} placeholder="Enter student's full name" className={inputClass} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Login email"><input required type="email" autoComplete="email" value={enrollForm.email} onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })} placeholder="student@example.com" className={inputClass} /></Field>
            <Field label="Contact (optional)"><input value={enrollForm.contact} onChange={(e) => setEnrollForm({ ...enrollForm, contact: e.target.value })} placeholder="Phone number" className={inputClass} /></Field>
          </div>
          <Field label="Temporary login password"><input required type="password" autoComplete="new-password" minLength={8} maxLength={128} value={enrollForm.password} onChange={(e) => setEnrollForm({ ...enrollForm, password: e.target.value })} placeholder="At least 8 characters" className={inputClass} /><span className="text-xs text-muted-foreground">Give this password to the student securely.</span></Field>
          <Field label="Course"><select required value={enrollForm.course} onChange={(e) => setEnrollForm({ ...enrollForm, course: e.target.value, batch: "" })} className={inputClass}><option value="">Select a course</option>{activeCourses.map((course) => <option key={course.id} value={course.name}>{course.name} — {formatINR(course.fee)}</option>)}</select></Field>
          <Field label="Batch"><select required value={enrollForm.batch} onChange={(e) => setEnrollForm({ ...enrollForm, batch: e.target.value })} className={inputClass}><option value="">Select a batch</option>{allBatches.map((batch) => <option key={batch.id || batch.name} value={batch.name}>{batch.name}</option>)}</select>{allBatches.length === 0 && <p className="text-xs text-amber-600">No batches found. Add a batch in Batch Management first.</p>}</Field>
          <Field label="Joining date"><input type="date" required value={enrollForm.joiningDate} onChange={(e) => setEnrollForm({ ...enrollForm, joiningDate: e.target.value })} className={inputClass} /></Field>
          <p className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">This creates the student profile and login account. Use a unique email and a password of at least 8 characters.</p>
          <ModalActions saving={saving} submitLabel="Confirm Enrollment" onCancel={() => setEnrollModal(false)} />
        </form>
      </Modal>}
    </div>
  );
}

const inputClass = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

function Field({ label, children }) {
  return <label className="block space-y-1.5"><span className="text-sm font-medium">{label}</span>{children}</label>;
}

function Modal({ title, onClose, children }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-label={title} className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-background p-5 shadow-xl sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3"><h2 className="text-xl font-bold">{title}</h2><button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-muted" aria-label="Close"><X className="size-5" /></button></div>
      {children}
    </section>
  </div>;
}

function ModalActions({ saving, submitLabel, onCancel }) {
  return <div className="flex justify-end gap-2 border-t border-border pt-4"><button type="button" onClick={onCancel} disabled={saving} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold">Cancel</button><button type="submit" disabled={saving} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">{saving ? "Saving…" : submitLabel}</button></div>;
}
