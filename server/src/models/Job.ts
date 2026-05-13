import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, default: "General", trim: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["open", "closed", "draft"], default: "open" },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
