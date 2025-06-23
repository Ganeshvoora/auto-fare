// models/Image.js
import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    base64: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);
