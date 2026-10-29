import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      default: "",
    },

    batch: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["PDF", "Assignment", "Notes", "Study Material", "Homework"],
      default: "PDF",
    },

    description: {
      type: String,
      default: "",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    size: {
      type: String,
      default: "",
    },

    fileUrl: {
      type: String,
      default: "",
    },

    uploadedBy: {
      type: String,
      default: "",
    },

    uploadedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Material = mongoose.model("Material", materialSchema);