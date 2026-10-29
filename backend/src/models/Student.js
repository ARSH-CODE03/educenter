
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentCode: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    course: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: Date,
    },
    totalFee: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Number,
      default: 0,
    },
    dueDate: {
      type: Date,
    },
    attendance: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true }
);

studentSchema.virtual("feeStatus").get(function () {
  if (this.paid >= this.totalFee) return "Paid";
  if (this.paid > 0) return "Partially Paid";
  return "Pending";
});

studentSchema.set("toJSON", { virtuals: true });
studentSchema.set("toObject", { virtuals: true });

export const Student = mongoose.model("Student", studentSchema);
