import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Teacher } from "../models/Teacher.js";
import { Student } from "../models/Student.js";
import { success, created } from "../utils/response.js";

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission for this action",
      });
    }

    next();
  };
};
export async function register(req, res, next) {
  try {
    const { name, email, password, role = "admin", title = "", centreName = "" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Name, email and password are required" },
      });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        error: { code: "CONFLICT", message: "Email already registered" },
      });
    }
    // Only allow admin self-registration for first user; otherwise restrict
    const userCount = await User.countDocuments();
    const finalRole = userCount === 0 ? "admin" : role === "admin" ? "admin" : role;
    const user = await User.create({ name, email, password, role: finalRole, title, centreName });
    const token = signToken(user);
    return created(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        centreName: user.centreName,
      },
    }, "Account created");
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Email and password are required" },
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
      });
    }
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "Account is disabled" },
      });
    }
    const token = signToken(user);
    return success(res, {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        centreName: user.centreName,
      },
    }, "Logged in");
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "User not found" },
      });
    }
    return success(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        centreName: user.centreName,
      },
    });
  } catch (err) {
    next(err);
  }
}


// Admin creates teacher/student login accounts and matching profile records.
export async function createManagedUser(req, res, next) {
  try {
    const { name, email, password, role, subject = "", batch = "", contact = "", title = "", centreName = "" } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!name || !normalizedEmail || !password || !["teacher", "student"].includes(role)) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Name, email, password and a valid teacher/student role are required" } });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Password must be at least 8 characters" } });
    }
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ success: false, error: { code: "CONFLICT", message: "Email already registered" } });
    }
    const user = await User.create({ name, email: normalizedEmail, password, role, title, centreName, phone: contact });
    if (role === "teacher") {
      const count = await Teacher.countDocuments();
      await Teacher.create({ teacherCode: `TCH-${String(count + 1).padStart(2, "0")}`, name, subject, batches: batch ? [String(batch)] : [], contact, email: normalizedEmail, status: "Active", user: user._id });
    } else {
      const count = await Student.countDocuments();
      await Student.create({ studentCode: `STU-${String(count + 1).padStart(2, "0")}`, name, email: normalizedEmail, contact, batch: batch ? String(batch) : "", status: "Active", user: user._id });
    }
    return created(res, { user: { id: user._id, name: user.name, email: user.email, role: user.role } }, `${role} account created`);
  } catch (err) {
    next(err);
  }
}
