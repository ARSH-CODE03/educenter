import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    studentCode: String,
    studentName: String,
    status: { type: String, enum: ["present", "absent", "late"], default: "present" },
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    batch: { type: String, required: true },
    date: { type: Date, required: true },
    markedBy: { type: String, default: "" },
    records: [recordSchema],
  },
  { timestamps: true }
);

attendanceSchema.index({ batch: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
