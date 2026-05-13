import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { User } from "../models/User.js";

export type AdminRequest = Request & { adminUserId?: string };

export async function requireAdmin(req: AdminRequest, res: Response, next: NextFunction) {
  const userId = req.header("x-user-id");
  if (!userId || !mongoose.isValidObjectId(userId)) {
    res.status(401).json({ error: "Missing or invalid x-user-id header" });
    return;
  }
  const user = await User.findById(userId).lean();
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  req.adminUserId = userId;
  next();
}
