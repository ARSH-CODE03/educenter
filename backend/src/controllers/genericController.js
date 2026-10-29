
import { Teacher } from "../models/Teacher.js";
import { Course } from "../models/Course.js";
import { Batch } from "../models/Batch.js";
import { Attendance } from "../models/Attendance.js";
import { Fee } from "../models/Fee.js";
import { Material } from "../models/Material.js";
import { Announcement } from "../models/Announcement.js";
import { Student } from "../models/Student.js";
import { User } from "../models/User.js";
import { success, created } from "../utils/response.js";

// ==================== HELPERS ====================

const getUserId = (user) => String(user?.id || user?._id || "");

async function findStudentProfile(user) {
  const userId = getUserId(user);
  const email = user?.email?.toLowerCase()?.trim();

  let student = null;

  if (userId) {
    student = await Student.findOne({ user: userId });
  }

  if (!student && email) {
    student = await Student.findOne({ email });
  }

  return student;
}

async function findTeacherProfile(user) {
  const email = user?.email?.toLowerCase()?.trim();

  if (email) {
    const teacher = await Teacher.findOne({ email });
    if (teacher) return teacher;
  }

  if (user?.teacherCode) {
    const teacher = await Teacher.findOne({
      teacherCode: user.teacherCode,
    });
    if (teacher) return teacher;
  }

  return null;
}

function mapBatch(batch) {
  return {
    id: batch.batchCode,
    batchCode: batch.batchCode,
    name: batch.name,
    course: batch.course,
    teacher: batch.teacher,
    timing: batch.timing,
    students: batch.studentsCount,
    studentsCount: batch.studentsCount,
    room: batch.room,
    status: batch.status,
  };
}

// ==================== TEACHERS ====================

export async function listTeachers(req, res, next) {
  try {
    const items = await Teacher.find().sort({ createdAt: -1 });

    return success(res, {
      teachers: items.map((teacher) => ({
        id: teacher.teacherCode,
        name: teacher.name,
        subject: teacher.subject,
        batches: teacher.batches,
        contact: teacher.contact,
        email: teacher.email,
        status: teacher.status,
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function createTeacher(req, res, next) {
  try {
    const count = await Teacher.countDocuments();

    const teacher = await Teacher.create({
      ...req.body,
      teacherCode:
        req.body.teacherCode ||
        `TCH-${String(count + 1).padStart(2, "0")}`,
      batches: req.body.batches || [],
    });

    return created(res, {
      teacher: {
        id: teacher.teacherCode,
        name: teacher.name,
        subject: teacher.subject,
        batches: teacher.batches,
        contact: teacher.contact,
        email: teacher.email,
        status: teacher.status,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ==================== COURSES ====================

export async function listCourses(req, res, next) {
  try {
    const items = await Course.find().sort({ createdAt: -1 });

    return success(res, {
      courses: items.map((course) => ({
        id: course.courseCode,
        name: course.name,
        duration: course.duration,
        students: course.studentsCount,
        teachers: course.teachers,
        fee: course.fee,
        status: course.status,
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function createCourse(req, res, next) {
  try {
    const count = await Course.countDocuments();

    const course = await Course.create({
      courseCode:
        req.body.courseCode ||
        `CRS-${String(count + 1).padStart(2, "0")}`,
      name: req.body.name,
      duration: req.body.duration || "",
      fee: Number(req.body.fee) || 0,
      teachers: req.body.teachers || [],
      status: req.body.status || "Active",
    });

    return created(res, {
      course: {
        id: course.courseCode,
        name: course.name,
        duration: course.duration,
        students: course.studentsCount || 0,
        teachers: course.teachers,
        fee: course.fee,
        status: course.status,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ==================== BATCHES ====================

export async function listBatches(req, res, next) {
  try {
    const items = await Batch.find().sort({ createdAt: -1 });

    return success(res, {
      batches: items.map(mapBatch),
    });
  } catch (err) {
    next(err);
  }
}

export async function createBatch(req, res, next) {
  try {
    const count = await Batch.countDocuments();

    const batch = await Batch.create({
      batchCode:
        req.body.batchCode ||
        `BCH-${String.fromCharCode(65 + count)}`,
      name: req.body.name,
      course: req.body.course,
      teacher: req.body.teacher || "",
      timing: req.body.timing || "",
      room: req.body.room || "",
      status: req.body.status || "Active",
    });

    return created(res, {
      batch: mapBatch(batch),
    });
  } catch (err) {
    next(err);
  }
}

// Teacher sees assigned batches.
// Student sees only the batch assigned to their student profile.
export async function getMyBatches(req, res, next) {
  try {
    const user = req.user || {};
    const role = String(user.role || "").toLowerCase();

    if (role === "student") {
      const student = await findStudentProfile(user);

      if (!student) {
        return res.status(404).json({
          success: false,
          error: {
            code: "STUDENT_PROFILE_NOT_FOUND",
            message:
              "No student profile is linked to this account. Check the student's user ID and email.",
          },
        });
      }

      const studentBatch = String(student.batch || "").trim();

      if (!studentBatch) {
        return success(res, { batches: [] });
      }

      const batch = await Batch.findOne({
        $or: [
          { batchCode: studentBatch },
          { name: studentBatch },
        ],
      });

      return success(res, {
        batches: batch ? [mapBatch(batch)] : [],
      });
    }

    if (role === "teacher") {
      const teacher = await findTeacherProfile(user);

      const teacherValues = [
        teacher?.teacherCode,
        teacher?.name,
        teacher?.email,
        user.teacherCode,
        user.name,
        user.email,
        user.id,
        user._id,
      ]
        .filter(Boolean)
        .map(String);

      if (!teacherValues.length) {
        return success(res, { batches: [] });
      }

      const batches = await Batch.find({
        teacher: { $in: teacherValues },
      }).sort({ createdAt: -1 });

      return success(res, {
        batches: batches.map(mapBatch),
      });
    }

    return res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "This account cannot access personal batches.",
      },
    });
  } catch (err) {
    next(err);
  }
}

// ==================== ATTENDANCE ====================

export async function listAttendance(req, res, next) {
  try {
    const filter = {};
    const role = String(req.user?.role || "").toLowerCase();

    if (req.query.batch) {
      filter.batch = req.query.batch;
    }

    if (req.query.date) {
      const date = new Date(req.query.date);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid attendance date.",
        });
      }

      filter.date = date;
    }

    // Students can view attendance only for their assigned batch.
    if (role === "student") {
      const student = await findStudentProfile(req.user);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student profile not found.",
        });
      }

      if (
        req.query.batch &&
        String(req.query.batch) !== String(student.batch)
      ) {
        return res.status(403).json({
          success: false,
          message: "You cannot view another batch's attendance.",
        });
      }

      filter.batch = student.batch;
    }

    const items = await Attendance.find(filter)
      .sort({ date: -1 })
      .limit(50);

    return success(res, { attendance: items });
  } catch (err) {
    next(err);
  }
}

export async function markAttendance(req, res, next) {
  try {
    const { batch, date, records, markedBy } = req.body;

    if (!batch || !date || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "batch, date and records array are required.",
        },
      });
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid attendance date.",
      });
    }

    const doc = await Attendance.findOneAndUpdate(
      { batch, date: parsedDate },
      {
        $set: {
          batch,
          date: parsedDate,
          records,
          markedBy: markedBy || req.user?.name || "Teacher",
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    return success(res, { attendance: doc }, "Attendance saved");
  } catch (err) {
    next(err);
  }
}

// ==================== FEES ====================

export async function listFees(req, res, next) {
  try {
    const role = String(req.user?.role || "").toLowerCase();
    let filter = {};

    if (role === "student") {
      const student = await findStudentProfile(req.user);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student profile not found.",
        });
      }

      filter.studentCode = student.studentCode;
    }

    const items = await Fee.find(filter)
      .sort({ date: -1 })
      .limit(100);

    return success(res, { fees: items });
  } catch (err) {
    next(err);
  }
}

export async function createFee(req, res, next) {
  try {
    const fee = await Fee.create(req.body);

    if (req.body.studentCode && req.body.amount) {
      await Student.findOneAndUpdate(
        { studentCode: req.body.studentCode },
        { $inc: { paid: Number(req.body.amount) } }
      );
    }

    return created(res, { fee });
  } catch (err) {
    next(err);
  }
}

// ==================== MATERIALS ====================

export async function listMaterials(req, res, next) {
  try {
    const role = String(req.user?.role || "").toLowerCase();
    let filter = {};

    if (role === "student") {
      const student = await findStudentProfile(req.user);

      if (!student) {
        return res.status(404).json({
          success: false,
          error: {
            code: "STUDENT_PROFILE_NOT_FOUND",
            message:
              "No student profile is linked to this account.",
          },
        });
      }

      const studentBatch = String(student.batch || "").trim();

      // Support materials assigned to the student's batch or
      // general materials that have no batch assigned.
      filter = studentBatch
        ? {
            $or: [
              { batch: studentBatch },
              { batch: "" },
              { batch: null },
            ],
          }
        : {
            $or: [{ batch: "" }, { batch: null }],
          };
    }

    const items = await Material.find(filter)
      .sort({ uploadedDate: -1, createdAt: -1 });

    return success(res, { materials: items });
  } catch (err) {
    next(err);
  }
}

export async function createMaterial(req, res, next) {
  try {
    const {
      title,
      subject,
      batch,
      type,
      description,
      dueDate,
      fileUrl,
      size,
    } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Material title is required.",
      });
    }

    const materialData = {
      title: title.trim(),
      subject: subject || "",
      batch: batch || "",
      type: type || "PDF",
      fileUrl: fileUrl || "",
      size: size || "",
      uploadedBy: req.user?.name || req.user?.email || "Teacher",
      uploadedDate: new Date(),
    };

    // Only include these fields when supported by the Material schema.
    if (description !== undefined) {
      materialData.description = description;
    }

    if (dueDate) {
      materialData.dueDate = dueDate;
    }

    const material = await Material.create(materialData);

    return created(res, { material });
  } catch (err) {
    next(err);
  }
}

// ==================== ANNOUNCEMENTS ====================

export async function listAnnouncements(req, res, next) {
  try {
    const items = await Announcement.find().sort({ date: -1 });

    return success(res, { announcements: items });
  } catch (err) {
    next(err);
  }
}

export async function createAnnouncement(req, res, next) {
  try {
    const ann = await Announcement.create({
      ...req.body,
      createdBy: req.user?.name || req.user?.email || "Admin",
      date: new Date(),
    });

    return created(res, { announcement: ann });
  } catch (err) {
    next(err);
  }
}

// ==================== DASHBOARD STATS ====================

export async function dashboardStats(req, res, next) {
  try {
    const role = String(req.user?.role || "").toLowerCase();

    // Student dashboard receives only that student's fee information
    // and general counts. Admin dashboards retain overall statistics.
    if (role === "student") {
      const student = await findStudentProfile(req.user);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student profile not found.",
        });
      }

      return success(res, {
        stats: {
          totalStudents: 1,
          teachers: 0,
          activeBatches: 0,
          pendingFees: Math.max(
            0,
            Number(student.totalFee || 0) - Number(student.paid || 0)
          ),
        },
        recentPayments: [],
        recentAnnouncements: await Announcement.find()
          .sort({ date: -1 })
          .limit(3),
      });
    }

    const [
      studentCount,
      teacherCount,
      batchCount,
      pendingFees,
      recentFees,
      recentAnnouncements,
    ] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Batch.countDocuments({ status: { $ne: "Closed" } }),
      Student.aggregate([
        {
          $project: {
            pending: {
              $subtract: [
                { $ifNull: ["$totalFee", 0] },
                { $ifNull: ["$paid", 0] },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$pending" },
          },
        },
      ]),
      Fee.find().sort({ date: -1 }).limit(4),
      Announcement.find().sort({ date: -1 }).limit(3),
    ]);

    return success(res, {
      stats: {
        totalStudents: studentCount,
        teachers: teacherCount,
        activeBatches: batchCount,
        pendingFees: pendingFees[0]?.total || 0,
      },
      recentPayments: recentFees,
      recentAnnouncements,
    });
  } catch (err) {
    next(err);
  }
}
