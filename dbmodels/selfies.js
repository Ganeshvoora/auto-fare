import mongoose from "mongoose";

const SelfiesSchema = new mongoose.Schema(
  {
    imageData: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Selfies || mongoose.model("selfies", SelfiesSchema);