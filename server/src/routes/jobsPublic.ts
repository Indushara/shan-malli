import { Router } from "express";
import { Job } from "../models/Job.js";

const router = Router();

router.get("/", async (_req, res) => {
  const jobs = await Job.find({ status: "open" }).sort({ createdAt: -1 }).lean();
  res.json(
    jobs.map((j) => ({
      id: String(j._id),
      title: j.title,
      department: j.department,
      description: j.description,
      status: j.status,
    }))
  );
});

export default router;
