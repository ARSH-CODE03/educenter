import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    batchCode: { type: String, unique: true, required: true },
    name: { type: String, required: true, trim: true },
    course: { type: String, required: true },
    teacher: { type: String, default: "" },
    timing: { type: String, default: "" },
    studentsCount: { type: Number, default: 0 },
    room: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Full", "Closed"], default: "Active" },
  },
  { timestamps: true }
);

export const Batch = mongoose.model("Batch", batchSchema);
