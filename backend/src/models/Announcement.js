import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    target: { type: String, enum: ["All", "Students", "Teachers", "Batch"], default: "All" },
    batch: { type: String, default: "" },
    createdBy: { type: String, default: "Admin" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model("Announcement", announcementSchema);
