import express from "express";
import Portfolio from "../models/Portfolio.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware: verify token
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

// ------------------------------------------------------------
// ADD CRYPTO TO PORTFOLIO
// ------------------------------------------------------------
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { coinId, coinName, quantity, buyPrice } = req.body;

    const entry = await Portfolio.create({
      userId: req.user,
      coinId,
      coinName,
      quantity,
      buyPrice,
    });

    res.json({ msg: "Added to portfolio", entry });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------------------------------------
// GET USER'S PORTFOLIO
// ------------------------------------------------------------
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ userId: req.user });

    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------------------------------------
// DELETE ENTRY
// ------------------------------------------------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ msg: "Entry deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
