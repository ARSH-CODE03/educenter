
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
import { success, created } from "../utils/response.js";

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function makeCode(prefix) {
  return `${prefix}-${new mongoose.Types.ObjectId().toString().slice(-8).toUpperCase()}`;
}

export const createManagedUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and role are required",
      });
    }

    if (!["teacher", "student"].includes(String(role).toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: "Only student or teacher accounts can be created",
      });
    }

    req.body = { name, email, password, role };
    return await register(req, res, next);
  } catch (error) {
    next(error);
  }
};

export async function register(req, res, next) {
  let createdUser;

  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    const role = String(req.body.role || "student").trim().toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Name, email and password are required.",
        },
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: {
          code: "WEAK_PASSWORD",
          message: "Password must be at least 8 characters.",
        },
      });
    }

    if (!["student", "teacher"].includes(role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: "ROLE_NOT_ALLOWED",
          message: "Admin accounts cannot be created through public registration.",
        },
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: "CONFLICT",
          message: "Email already registered.",
        },
      });
    }

    const Profile = role === "student" ? Student : Teacher;
    const existingProfile = await Profile.findOne({ email });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        error: {
          code: "PROFILE_EXISTS",
          message: "A profile already exists for this email. Contact the centre administrator.",
        },
      });
    }

    const session = await mongoose.startSession();
    let profile;

    try {
      await session.withTransaction(async () => {
        const duplicate = await User.findOne({ email }).session(session);

        if (duplicate) {
          const error = new Error("Email already registered.");
          error.code = "EMAIL_CONFLICT";
          throw error;
        }

        [createdUser] = await User.create(
          [{
            name,
            email,
            password,
            role,
            title: role === "teacher" ? "Teacher" : "Student",
          }],
          { session }
        );

        if (role === "student") {
          [profile] = await Student.create(
            [{
              studentCode: makeCode("STU"),
              name,
              email,
              course: "General",
              batch: "Unassigned",
              joiningDate: new Date(),
              user: createdUser._id,
            }],
            { session }
          );
        } else {
          [profile] = await Teacher.create(
            [{
              teacherCode: makeCode("TCH"),
              name,
              email,
              subject: "",
              batches: [],
              status: "Active",
              user: createdUser._id,
            }],
            { session }
          );
        }
      });
    } catch (error) {
      if (error.code === "EMAIL_CONFLICT" || error.code === 11000) {
        return res.status(409).json({
          success: false,
          error: {
            code: "CONFLICT",
            message: "Email or profile code already exists. Please try again.",
          },
        });
      }

      throw error;
    } finally {
      await session.endSession();
    }

    const token = signToken(createdUser);

    return created(
      res,
      {
        token,
        user: {
          id: createdUser._id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          title: createdUser.title,
        },
      },
      "Account and profile created successfully"
    );
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Email and password are required.",
        },
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password.",
        },
      });
    }

    const configuredAdminEmail = String(
      process.env.ADMIN_EMAIL || ""
    ).trim().toLowerCase();

    if (
      user.role === "admin" &&
      (!configuredAdminEmail || user.email !== configuredAdminEmail)
    ) {
      return res.status(403).json({
        success: false,
        error: {
          code: "ADMIN_ACCOUNT_RESTRICTED",
          message: "This administrator account is not authorised.",
        },
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Account is disabled.",
        },
      });
    }

    const token = signToken(user);

    return success(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          title: user.title,
        },
      },
      "Logged in"
    );
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "User not found or disabled.",
        },
      });
    }

    return success(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
      },
    });
  } catch (err) {
    next(err);
  }
}
