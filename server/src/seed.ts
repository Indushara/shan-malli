import { User } from "./models/User.js";
import { Job } from "./models/Job.js";
import { hashPassword } from "./lib/password.js";

const defaultJobs = [
  { title: "AI Intern", department: "Research", description: "Campus AI research support.", status: "open" as const },
  {
    title: "Frontend Developer",
    department: "Engineering",
    description: "React / Next.js product work.",
    status: "open" as const,
  },
  {
    title: "ML Engineer",
    department: "Engineering",
    description: "Model training and deployment.",
    status: "open" as const,
  },
  {
    title: "Data Analyst",
    department: "Analytics",
    description: "Dashboards and insights.",
    status: "open" as const,
  },
];

export async function seedDatabase(): Promise<void> {
  const adminEmail = "admin@campus.ai";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const password = await hashPassword("admin123");
    await User.create({
      name: "System Admin",
      email: adminEmail,
      password,
      role: "admin",
    });
    console.log("Seeded default admin user (admin@campus.ai / admin123)");
  }

  const jobCount = await Job.countDocuments();
  if (jobCount === 0) {
    await Job.insertMany(defaultJobs);
    console.log("Seeded default job postings");
  }
}
