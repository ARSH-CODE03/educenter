
import { Router } from "express";
import rateLimit from "express-rate-limit";

import * as auth from "../controllers/authController.js";
import * as students from "../controllers/studentController.js";
import * as generic from "../controllers/genericController.js";

import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

// ==================== RATE LIMIT ====================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT",
      message: "Too many attempts, try later",
    },
  },
});

// ==================== HEALTH ====================

router.get("/health", (req, res) => {
  res.json({
    success: true,
    data: { status: "ok" },
    message: "Healthy",
  });
});

// ==================== AUTH ====================

router.post("/auth/register", authLimiter, auth.register);
router.post("/auth/login", authLimiter, auth.login);

router.post(
  "/auth/users",
  protect,
  restrictTo("admin"),
  auth.createManagedUser
);

router.get("/auth/me", protect, auth.me);

// ==================== STUDENTS ====================

// Admin and teachers can view the student list.
router.get(
  "/students",
  protect,
  restrictTo("admin", "teacher"),
  students.listStudents
);

// Only admin can create, update, or delete student records.
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

// Students can view their own profile and classmates.
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

// ==================== TEACHERS ====================

router.get(
  "/teachers",
  protect,
  generic.listTeachers
);

router.post(
  "/teachers",
  protect,
  restrictTo("admin"),
  generic.createTeacher
);

// ==================== COURSES ====================

router.get(
  "/courses",
  protect,
  generic.listCourses
);

router.post(
  "/courses",
  protect,
  restrictTo("admin"),
  generic.createCourse
);

// ==================== BATCHES ====================

router.get(
  "/batches",
  protect,
  generic.listBatches
);

router.post(
  "/batches",
  protect,
  restrictTo("admin"),
  generic.createBatch
);

// Teacher sees assigned batches; student sees their own batch.
// generic.getMyBatches must handle both roles.
router.get(
  "/batches/my",
  protect,
  restrictTo("teacher", "student"),
  generic.getMyBatches
);

// ==================== ATTENDANCE ====================

router.get(
  "/attendance",
  protect,
  generic.listAttendance
);

router.post(
  "/attendance",
  protect,
  restrictTo("admin", "teacher"),
  generic.markAttendance
);

// ==================== FEES ====================

// The controller should filter student results to their own fee records.
router.get(
  "/fees",
  protect,
  generic.listFees
);

router.post(
  "/fees",
  protect,
  restrictTo("admin"),
  generic.createFee
);

// ==================== MATERIALS ====================

// Authenticated students, teachers, and admins can view materials.
router.get(
  "/materials",
  protect,
  restrictTo("admin", "teacher", "student"),
  generic.listMaterials
);

// Only teachers and admins can create materials.
router.post(
  "/materials",
  protect,
  restrictTo("admin", "teacher"),
  generic.createMaterial
);

// ==================== ANNOUNCEMENTS ====================

router.get(
  "/announcements",
  protect,
  generic.listAnnouncements
);

router.post(
  "/announcements",
  protect,
  restrictTo("admin", "teacher"),
  generic.createAnnouncement
);

// ==================== DASHBOARD / REPORTS ====================

router.get(
  "/dashboard",
  protect,
  generic.dashboardStats
);

router.get(
  "/reports",
  protect,
  restrictTo("admin"),
  generic.dashboardStats
);

router.post(
  "/students/link-existing-account",
  protect,
  restrictTo("admin"),
  students.createStudentProfileForExistingUser
);

export default router;
