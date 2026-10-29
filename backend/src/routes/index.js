
import { Router } from "express";
import rateLimit from "express-rate-limit";

import * as auth from "../controllers/authController.js";
import * as students from "../controllers/studentController.js";
import * as generic from "../controllers/genericController.js";

import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

// Check required controller exports before registering routes.
const requiredHandlers = [
  ["auth.register", auth.register],
  ["auth.login", auth.login],
  ["auth.me", auth.me],
  ["students.listStudents", students.listStudents],
  ["students.createStudent", students.createStudent],
  ["students.updateStudent", students.updateStudent],
  ["students.deleteStudent", students.deleteStudent],
  ["students.getMyStudent", students.getMyStudent],
  ["students.getMyClassmates", students.getMyClassmates],
  ["students.createStudentProfileForExistingUser", students.createStudentProfileForExistingUser],
  ["generic.listTeachers", generic.listTeachers],
  ["generic.createTeacher", generic.createTeacher],
  ["generic.listCourses", generic.listCourses],
  ["generic.createCourse", generic.createCourse],
  ["generic.listBatches", generic.listBatches],
  ["generic.createBatch", generic.createBatch],
  ["generic.listAttendance", generic.listAttendance],
  ["generic.markAttendance", generic.markAttendance],
  ["generic.listFees", generic.listFees],
  ["generic.createFee", generic.createFee],
  ["generic.listMaterials", generic.listMaterials],
  ["generic.createMaterial", generic.createMaterial],
  ["generic.listAnnouncements", generic.listAnnouncements],
  ["generic.createAnnouncement", generic.createAnnouncement],
  ["generic.dashboardStats", generic.dashboardStats],
];

const missingHandlers = requiredHandlers
  .filter(([, handler]) => typeof handler !== "function")
  .map(([name]) => name);

if (typeof protect !== "function" || typeof restrictTo !== "function") {
  throw new Error("Missing protect or restrictTo export in middleware/auth.js");
}

if (missingHandlers.length > 0) {
  throw new Error(
    `Missing controller exports: ${missingHandlers.join(", ")}`
  );
}

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many attempts. Please try again later.",
    },
  },
});

// Health
router.get("/health", (req, res) => {
  res.json({
    success: true,
    data: { status: "ok" },
    message: "Healthy",
  });
});

// Authentication
router.post("/auth/register", authLimiter, auth.register);
router.post("/auth/login", authLimiter, auth.login);
router.get("/auth/me", protect, auth.me);

// Optional admin-managed user creation
if (typeof auth.createManagedUser === "function") {
  router.post(
    "/auth/users",
    protect,
    restrictTo("admin"),
    auth.createManagedUser
  );
} else {
  console.warn("Optional endpoint unavailable: POST /api/auth/users");
}

// Students
router.get(
  "/students",
  protect,
  restrictTo("admin", "teacher"),
  students.listStudents
);

router.post(
  "/students",
  protect,
  restrictTo("admin"),
  students.createStudent
);

router.put(
  "/students/:id",
  protect,
  restrictTo("admin"),
  students.updateStudent
);

router.delete(
  "/students/:id",
  protect,
  restrictTo("admin"),
  students.deleteStudent
);

router.get(
  "/students/me",
  protect,
  restrictTo("student"),
  students.getMyStudent
);

router.get(
  "/students/my-classmates",
  protect,
  restrictTo("student"),
  students.getMyClassmates
);

router.post(
  "/students/link-existing-account",
  protect,
  restrictTo("admin"),
  students.createStudentProfileForExistingUser
);

// Teachers
router.get("/teachers", protect, generic.listTeachers);

router.post(
  "/teachers",
  protect,
  restrictTo("admin"),
  generic.createTeacher
);

// Courses
router.get("/courses", protect, generic.listCourses);

router.post(
  "/courses",
  protect,
  restrictTo("admin"),
  generic.createCourse
);

// Batches
router.get("/batches", protect, generic.listBatches);

router.post(
  "/batches",
  protect,
  restrictTo("admin"),
  generic.createBatch
);

// Personal batches endpoint
if (typeof generic.getMyBatches === "function") {
  router.get(
    "/batches/my",
    protect,
    restrictTo("teacher", "student"),
    generic.getMyBatches
  );
} else {
  console.warn(
    "Endpoint unavailable: GET /api/batches/my — add getMyBatches to genericController.js"
  );
}

// Attendance
router.get("/attendance", protect, generic.listAttendance);

router.post(
  "/attendance",
  protect,
  restrictTo("admin", "teacher"),
  generic.markAttendance
);

// Fees
router.get("/fees", protect, generic.listFees);

router.post(
  "/fees",
  protect,
  restrictTo("admin"),
  generic.createFee
);

// Materials
router.get(
  "/materials",
  protect,
  restrictTo("admin", "teacher", "student"),
  generic.listMaterials
);

router.post(
  "/materials",
  protect,
  restrictTo("admin", "teacher"),
  generic.createMaterial
);

// Announcements
router.get("/announcements", protect, generic.listAnnouncements);

router.post(
  "/announcements",
  protect,
  restrictTo("admin", "teacher"),
  generic.createAnnouncement
);

// Dashboard and reports
router.get("/dashboard", protect, generic.dashboardStats);

router.get(
  "/reports",
  protect,
  restrictTo("admin"),
  generic.dashboardStats
);

export default router;
