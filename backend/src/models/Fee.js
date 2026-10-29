import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    studentCode: { type: String, required: true },
    studentName: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["UPI", "Cash", "Bank Transfer", "Card"], default: "UPI" },
    date: { type: Date, default: Date.now },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Fee = mongoose.model("Fee", feeSchema);
