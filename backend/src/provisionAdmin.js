import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);




import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";

async function provisionAdmin() {
  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "");
  const name = String(process.env.ADMIN_NAME || "EduCentre Administrator").trim();

  if (!email || password.length < 8) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 8 characters) in backend/.env.");
  }

  await connectDB();
  const existing = await User.findOne({ email }).select("+password");
  if (existing) {
    existing.name = name;
    existing.password = password;
    existing.role = "admin";
    existing.isActive = true;
    existing.title = "Centre Administrator";
    await existing.save();
  } else {
    await User.create({ name, email, password, role: "admin", title: "Centre Administrator", isActive: true });
  }

  // Only the configured account remains enabled with the admin role.
  await User.updateMany(
    { role: "admin", email: { $ne: email } },
    { $set: { isActive: false } }
  );

  console.log(`Provisioned the single active admin account: ${email}`);
  await mongoose.disconnect();
}

provisionAdmin().catch(async (err) => {
  console.error("Admin provisioning failed:", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exitCode = 1;
});
