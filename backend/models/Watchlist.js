import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coinId: { type: String, required: true },       // e.g., bitcoin
  coinName: { type: String, required: true },     // e.g., Bitcoin
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Watchlist", watchlistSchema);
