import { Router } from "express";
import { User } from "../models/User.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { toPublicUser } from "../lib/serializeUser.js";

const router = Router();

router.post("/login", async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  res.json({ user: toPublicUser(user) });
});

router.post("/register", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required" });
    return;
  }
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409).json({ error: "User already exists with this email" });
    return;
  }
  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed, role: "user" });
  res.status(201).json({ user: toPublicUser(user) });
});

export default router;
