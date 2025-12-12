import express from "express";
import jwt from "jsonwebtoken";
import Watchlist from "../models/Watchlist.js";

const router = express.Router();

// Middleware to verify token
function authMiddleware(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid token" });
  }
}

// ADD TO WATCHLIST
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { coinId, coinName } = req.body;

    // prevent duplicates
    const exists = await Watchlist.findOne({
      userId: req.user,
      coinId,
    });

    if (exists)
      return res.status(400).json({ msg: "Already in watchlist" });

    const entry = await Watchlist.create({
      userId: req.user,
      coinId,
      coinName,
    });

    res.json({ msg: "Added to watchlist", entry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET WATCHLIST
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const items = await Watchlist.find({ userId: req.user });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// REMOVE FROM WATCHLIST
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Watchlist.findByIdAndDelete(req.params.id);
    res.json({ msg: "Removed from watchlist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
