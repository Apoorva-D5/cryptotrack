import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coinId: { type: String, required: true },      // e.g., "bitcoin"
  coinName: { type: String, required: true },    // e.g., "Bitcoin"
  quantity: { type: Number, required: true },    // e.g., 0.5
  buyPrice: { type: Number, required: true },    // user's purchase price
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Portfolio", portfolioSchema);
