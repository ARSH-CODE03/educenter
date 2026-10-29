
import { User } from "../models/User.js";
import { Student } from "../models/Student.js";
import { success, created } from "../utils/response.js";

export async function createStudentProfileForExistingUser(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const course = String(req.body.course || "").trim();
    const batch = String(req.body.batch || "").trim();

    if (!email || !course || !batch) {
      return res.status(400).json({
        success: false,
        message: "Email, course and batch are required.",
      });
    }

    // Find the existing login account. Do not create another User.
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No existing login account found for this email.",
      });
    }

    if (String(user.role).toLowerCase() !== "student") {
      return res.status(400).json({
        success: false,
        message: "The existing account is not a student account.",
      });
    }

    // Prevent duplicate student profiles.
    const existingProfile = await Student.findOne({
      $or: [{ user: user._id }, { email }],
    });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "A student profile already exists for this account or email.",
      });
    }

    // Generate a unique student code.
    const count = await Student.countDocuments();
    let number = 1001 + count;
    let studentCode = `STU-${number}`;

    while (await Student.exists({ studentCode })) {
      number += 1;
      studentCode = `STU-${number}`;
    }

    const student = await Student.create({
      studentCode,
      name: user.name,
      email: user.email,
      contact: user.phone || "",
      course,
      batch,
      totalFee: 0,
      paid: 0,
      attendance: 0,
      user: user._id, // Link the existing login account.
    });

    return created(
      res,
      { student },
      "Student profile created and linked to the existing account."
    );
  } catch (err) {
    next(err);
  }
}

// ==================== HELPERS ====================

function toClient(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;

  return {
    id: obj.studentCode,
    studentCode: obj.studentCode,
    name: obj.name,
    contact: obj.contact || "",
    email: obj.email || "",
    course: obj.course,
    batch: obj.batch,
    joiningDate: obj.joiningDate
      ? new Date(obj.joiningDate).toISOString().slice(0, 10)
      : "",
    totalFee: obj.totalFee || 0,
    paid: obj.paid || 0,
    dueDate: obj.dueDate
      ? new Date(obj.dueDate).toISOString().slice(0, 10)
      : "",
    attendance: obj.attendance || 0,
    feeStatus:
      obj.feeStatus ||
      (obj.paid >= obj.totalFee
        ? "Paid"
        : obj.paid > 0
          ? "Partially Paid"
          : "Pending"),
    hasLoginAccount: Boolean(obj.user),
  };
}

function validationError(message) {
  return Object.assign(new Error(message), {
    statusCode: 400,
    code: "VALIDATION_ERROR",
  });
}

// Match the student by linked User ID first, then by email.
async function findLoggedInStudent(user) {
  const userId = user?.id || user?._id;
  const email = String(user?.email || "").trim().toLowerCase();

  let student = null;

  if (userId) {
    student = await Student.findOne({ user: userId });
  }

  if (!student && email) {
    student = await Student.findOne({ email });
  }

  return student;
}

// ==================== MY PROFILE ====================

export async function getMyStudent(req, res, next) {
  try {
    const student = await findLoggedInStudent(req.user);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          code: "STUDENT_PROFILE_NOT_FOUND",
          message:
            "Student profile not found. Check the logged-in email and the student record in the database.",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        student: toClient(student),
      },
    });
  } catch (err) {
    next(err);
  }
}

// ==================== MY CLASSMATES ====================

export async function getMyClassmates(req, res, next) {
  try {
    const student = await findLoggedInStudent(req.user);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found.",
      });
    }

    const classmates = await Student.find({
      batch: student.batch,
      _id: { $ne: student._id },
    })
      .select("studentCode name course attendance batch")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        students: classmates.map((item) => ({
          id: item.studentCode,
          studentCode: item.studentCode,
          name: item.name,
          course: item.course,
          attendance: item.attendance || 0,
          batch: item.batch,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
}

// ==================== LIST STUDENTS ====================

export async function listStudents(req, res, next) {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    return success(res, {
      students: students.map(toClient),
    });
  } catch (err) {
    next(err);
  }
}

// ==================== CREATE STUDENT ====================

export async function createStudent(req, res, next) {
  let createdUserId = null;

  try {
    const {
      name,
      contact = "",
      email,
      password,
      course,
      batch,
      joiningDate,
      totalFee = 0,
      paid = 0,
    } = req.body;

    const normalizedName = String(name || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedCourse = String(course || "").trim();
    const normalizedBatch = String(batch || "").trim();

    if (
      !normalizedName ||
      !normalizedEmail ||
      !password ||
      !normalizedCourse ||
      !normalizedBatch
    ) {
      throw validationError(
        "Name, login email, password, course and batch are required."
      );
    }

    if (String(password).length < 8) {
      throw validationError(
        "Student login password must be at least 8 characters."
      );
    }

    if (String(password).length > 128) {
      throw validationError("Password must be 128 characters or fewer.");
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).select("_id");

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: "EMAIL_IN_USE",
          message: "An account with this email already exists.",
        },
      });
    }

    const existingStudent = await Student.findOne({
      studentCode: { $exists: true },
      email: normalizedEmail,
    }).select("_id");

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        error: {
          code: "STUDENT_EXISTS",
          message: "A student profile with this email already exists.",
        },
      });
    }

    const count = await Student.countDocuments();
    let nextCodeNumber = 1001 + count;

    while (
      await Student.exists({
        studentCode: `STU-${nextCodeNumber}`,
      })
    ) {
      nextCodeNumber += 1;
    }

    const studentCode = `STU-${nextCodeNumber}`;

    // Role is assigned on the server, not accepted from user input.
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: String(password),
      role: "student",
      phone: String(contact || "").trim(),
      isActive: true,
    });

    createdUserId = user._id;

    const student = await Student.create({
      studentCode,
      name: normalizedName,
      contact: String(contact || "").trim(),
      email: normalizedEmail,
      course: normalizedCourse,
      batch: normalizedBatch,
      joiningDate: joiningDate ? new Date(joiningDate) : undefined,
      totalFee: Math.max(0, Number(totalFee) || 0),
      paid: Math.max(0, Number(paid) || 0),
      attendance: 0,
      user: user._id,
    });

    return created(
      res,
      { student: toClient(student) },
      "Student and login account created."
    );
  } catch (err) {
    // Roll back account creation if the student profile could not be saved.
    if (createdUserId) {
      try {
        await User.findByIdAndDelete(createdUserId);
      } catch {
        console.error(
          "Could not roll back the student login account."
        );
      }
    }

    if (err?.code === 11000) {
      return res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message: "That email or student code already exists.",
        },
      });
    }

    if (err?.statusCode === 400) {
      return res.status(400).json({
        success: false,
        error: {
          code: err.code,
          message: err.message,
        },
      });
    }

    next(err);
  }
}

// ==================== UPDATE STUDENT ====================

export async function updateStudent(req, res, next) {
  try {
    const student = await Student.findOne({
      studentCode: req.params.id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Student not found.",
        },
      });
    }

    const fields = [
      "name",
      "contact",
      "email",
      "course",
      "batch",
      "totalFee",
      "paid",
      "attendance",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        student[field] =
          field === "email"
            ? String(req.body[field]).trim().toLowerCase()
            : req.body[field];
      }
    });

    if (req.body.joiningDate) {
      student.joiningDate = new Date(req.body.joiningDate);
    }

    if (req.body.dueDate) {
      student.dueDate = new Date(req.body.dueDate);
    }

    await student.save();

    if (student.user) {
      const linkedUser = await User.findById(student.user);

      if (linkedUser) {
        if (req.body.name !== undefined) {
          linkedUser.name = String(req.body.name).trim();
        }

        if (req.body.email !== undefined) {
          linkedUser.email = String(req.body.email).trim().toLowerCase();
        }

        if (req.body.contact !== undefined) {
          linkedUser.phone = String(req.body.contact).trim();
        }

        await linkedUser.save();
      }
    }

    return success(
      res,
      { student: toClient(student) },
      "Student updated."
    );
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message: "That email is already in use.",
        },
      });
    }

    next(err);
  }
}

// ==================== DELETE STUDENT ====================

export async function deleteStudent(req, res, next) {
  try {
    const student = await Student.findOne({
      studentCode: req.params.id,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Student not found.",
        },
      });
    }

    if (student.user) {
      await User.findByIdAndDelete(student.user);
    }

    await student.deleteOne();

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
