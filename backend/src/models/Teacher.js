import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    teacherCode: { type: String, unique: true, required: true },
    name: { type: String, required: true, trim: true },
    subject: { type: String, default: "" },
    batches: [{ type: String }],
    contact: { type: String, default: "" },
    email: { type: String, lowercase: true, trim: true },
    status: { type: String, enum: ["Active", "On Leave", "Inactive"], default: "Active" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Teacher = mongoose.model("Teacher", teacherSchema);
