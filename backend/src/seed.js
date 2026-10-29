import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";
import { Student } from "./models/Student.js";
import { Teacher } from "./models/Teacher.js";
import { Course } from "./models/Course.js";
import { Batch } from "./models/Batch.js";
import { Material } from "./models/Material.js";
import { Announcement } from "./models/Announcement.js";
import { Fee } from "./models/Fee.js";

const studentsSeed = [
  { studentCode: "STU-1001", name: "Aarav Sharma", contact: "+91 98200 11223", email: "aarav@example.com", course: "Class 10 Science", batch: "Batch A - Morning", joiningDate: "2025-04-12", totalFee: 24000, paid: 24000, dueDate: "2025-07-05", attendance: 94 },
  { studentCode: "STU-1002", name: "Diya Patel", contact: "+91 98111 44556", email: "diya@example.com", course: "Class 12 Commerce", batch: "Batch C - Evening", joiningDate: "2025-05-02", totalFee: 30000, paid: 18000, dueDate: "2025-08-15", attendance: 88 },
  { studentCode: "STU-1003", name: "Kabir Verma", contact: "+91 99880 77661", email: "kabir@example.com", course: "Class 10 Maths", batch: "Batch B - Afternoon", joiningDate: "2025-03-21", totalFee: 20000, paid: 0, dueDate: "2025-07-30", attendance: 72 },
  { studentCode: "STU-1004", name: "Ishita Nair", contact: "+91 90045 22118", email: "ishita@example.com", course: "Class 12 Science", batch: "Batch D - Morning", joiningDate: "2025-06-01", totalFee: 34000, paid: 34000, dueDate: "2025-09-01", attendance: 97 },
  { studentCode: "STU-1005", name: "Rohan Gupta", contact: "+91 88770 65432", email: "rohan@example.com", course: "Class 11 Commerce", batch: "Batch C - Evening", joiningDate: "2025-02-14", totalFee: 26000, paid: 13000, dueDate: "2025-08-05", attendance: 81 },
  { studentCode: "STU-1006", name: "Ananya Singh", contact: "+91 97654 32109", email: "ananya@example.com", course: "Class 10 Science", batch: "Batch A - Morning", joiningDate: "2025-04-18", totalFee: 24000, paid: 24000, dueDate: "2025-07-05", attendance: 91 },
  { studentCode: "STU-1007", name: "Vivaan Joshi", contact: "+91 93456 78012", email: "vivaan@example.com", course: "Class 12 Commerce", batch: "Batch C - Evening", joiningDate: "2025-01-09", totalFee: 30000, paid: 22000, dueDate: "2025-07-20", attendance: 76 },
  { studentCode: "STU-1008", name: "Meera Iyer", contact: "+91 91234 56780", email: "meera@example.com", course: "Class 11 Science", batch: "Batch B - Afternoon", joiningDate: "2025-05-27", totalFee: 28000, paid: 0, dueDate: "2025-08-28", attendance: 85 },
];

async function seed() {
  await connectDB();
  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Student.deleteMany({}),
    Teacher.deleteMany({}),
    Course.deleteMany({}),
    Batch.deleteMany({}),
    Material.deleteMany({}),
    Announcement.deleteMany({}),
    Fee.deleteMany({}),
  ]);

  console.log("Creating users...");
  await User.create([
    { name: "Priya Malhotra", email: "admin@educentre.in", password: "password123", role: "admin", title: "Centre Administrator" },
    { name: "Rakesh Menon", email: "rakesh@educentre.in", password: "password123", role: "teacher", title: "Physics Faculty" },
    { name: "Aarav Sharma", email: "aarav@example.com", password: "password123", role: "student", title: "Class 10 Science" },
  ]);

  console.log("Seeding students...");
  await Student.insertMany(
    studentsSeed.map((s) => ({
      ...s,
      joiningDate: new Date(s.joiningDate),
      dueDate: new Date(s.dueDate),
    }))
  );

  console.log("Seeding teachers...");
  await Teacher.insertMany([
    { teacherCode: "TCH-01", name: "Rakesh Menon", subject: "Physics", batches: ["Batch A - Morning", "Batch D - Morning"], contact: "+91 98765 43210", email: "rakesh@educentre.in", status: "Active" },
    { teacherCode: "TCH-02", name: "Sunita Deshmukh", subject: "Mathematics", batches: ["Batch B - Afternoon"], contact: "+91 99001 23456", email: "sunita@educentre.in", status: "Active" },
    { teacherCode: "TCH-03", name: "Imran Qureshi", subject: "Accountancy", batches: ["Batch C - Evening"], contact: "+91 90909 11223", email: "imran@educentre.in", status: "Active" },
    { teacherCode: "TCH-04", name: "Kavita Rao", subject: "Chemistry", batches: ["Batch A - Morning", "Batch B - Afternoon"], contact: "+91 88991 22334", email: "kavita@educentre.in", status: "On Leave" },
    { teacherCode: "TCH-05", name: "Amit Bansal", subject: "Economics", batches: ["Batch C - Evening"], contact: "+91 97000 55443", email: "amit@educentre.in", status: "Active" },
  ]);

  console.log("Seeding courses & batches...");
  await Course.insertMany([
    { courseCode: "CRS-01", name: "Class 10 Science", duration: "10 months", studentsCount: 62, teachers: ["Rakesh Menon", "Kavita Rao"], fee: 24000, status: "Active" },
    { courseCode: "CRS-02", name: "Class 10 Maths", duration: "8 months", studentsCount: 41, teachers: ["Sunita Deshmukh"], fee: 20000, status: "Active" },
    { courseCode: "CRS-03", name: "Class 11 Science", duration: "12 months", studentsCount: 35, teachers: ["Rakesh Menon"], fee: 28000, status: "Active" },
    { courseCode: "CRS-04", name: "Class 11 Commerce", duration: "12 months", studentsCount: 28, teachers: ["Amit Bansal"], fee: 26000, status: "Active" },
    { courseCode: "CRS-05", name: "Class 12 Science", duration: "12 months", studentsCount: 44, teachers: ["Rakesh Menon", "Kavita Rao"], fee: 34000, status: "Active" },
    { courseCode: "CRS-06", name: "Class 12 Commerce", duration: "12 months", studentsCount: 38, teachers: ["Imran Qureshi", "Amit Bansal"], fee: 30000, status: "Closed" },
  ]);

  await Batch.insertMany([
    { batchCode: "BCH-A", name: "Batch A - Morning", course: "Class 10 Science", teacher: "Rakesh Menon", timing: "7:00 AM – 9:00 AM", studentsCount: 32, room: "Room 1", status: "Active" },
    { batchCode: "BCH-B", name: "Batch B - Afternoon", course: "Class 10 Maths", teacher: "Sunita Deshmukh", timing: "1:00 PM – 3:00 PM", studentsCount: 28, room: "Room 2", status: "Active" },
    { batchCode: "BCH-C", name: "Batch C - Evening", course: "Class 12 Commerce", teacher: "Imran Qureshi", timing: "5:30 PM – 7:30 PM", studentsCount: 30, room: "Room 3", status: "Active" },
    { batchCode: "BCH-D", name: "Batch D - Morning", course: "Class 12 Science", teacher: "Rakesh Menon", timing: "8:00 AM – 10:00 AM", studentsCount: 26, room: "Room 1", status: "Full" },
  ]);

  console.log("Seeding materials, announcements, fees...");
  await Material.insertMany([
    { title: "Light – Reflection & Refraction Notes", subject: "Physics", batch: "Batch A - Morning", uploadedDate: new Date("2026-07-28"), type: "PDF", size: "2.4 MB" },
    { title: "Quadratic Equations Worksheet", subject: "Mathematics", batch: "Batch B - Afternoon", uploadedDate: new Date("2026-07-26"), type: "PDF", size: "860 KB" },
    { title: "Partnership Accounts Assignment", subject: "Accountancy", batch: "Batch C - Evening", uploadedDate: new Date("2026-07-24"), type: "DOCX", size: "410 KB" },
  ]);

  await Announcement.insertMany([
    { title: "Monthly test on 12th August", content: "All Class 10 batches will have their monthly assessment on 12th August. Syllabus: chapters 1–4.", target: "Students", date: new Date("2026-08-02"), createdBy: "Admin Office" },
    { title: "Holiday – Independence Day", content: "The centre will remain closed on 15th August. Evening batches resume on 16th August.", target: "All", date: new Date("2026-08-01"), createdBy: "Admin Office" },
    { title: "Batch C class rescheduled", content: "Accountancy class of Batch C on Friday shifts to 6:30 PM due to a faculty meeting.", target: "Batch", batch: "Batch C - Evening", date: new Date("2026-07-29"), createdBy: "Imran Qureshi" },
  ]);

  await Fee.insertMany([
    { studentCode: "STU-1004", studentName: "Ishita Nair", amount: 17000, method: "UPI", date: new Date("2026-08-02") },
    { studentCode: "STU-1001", studentName: "Aarav Sharma", amount: 12000, method: "Cash", date: new Date("2026-08-01") },
    { studentCode: "STU-1007", studentName: "Vivaan Joshi", amount: 8000, method: "Bank Transfer", date: new Date("2026-07-31") },
    { studentCode: "STU-1006", studentName: "Ananya Singh", amount: 12000, method: "UPI", date: new Date("2026-07-30") },
  ]);

  console.log("Seed completed successfully.");
  console.log("Demo logins (password for all: password123):");
  console.log("  admin@educentre.in  (admin)");
  console.log("  rakesh@educentre.in (teacher)");
  console.log("  aarav@example.com   (student)");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
