import mongoose from "mongoose";

const SelfySchema = new mongoose.Schema(
  {
    imageData: { type: String, required: true },
  },
  { timestamps: true }
);

  


export default mongoose.models.Selfy || mongoose.model("Selfy", SelfySchema);