import mongoose from "mongoose";

const favouritesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shoes",
      required: true,
    },
  },
  { timestamps: true }
);

favouritesSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model("Favourites", favouritesSchema);
