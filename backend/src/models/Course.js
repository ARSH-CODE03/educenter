import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseCode: { type: String, unique: true, required: true },
    name: { type: String, required: true, trim: true },
    duration: { type: String, default: "" },
    fee: { type: Number, default: 0 },
    studentsCount: { type: Number, default: 0 },
    teachers: [{ type: String }],
    status: { type: String, enum: ["Active", "Closed"], default: "Active" },
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
