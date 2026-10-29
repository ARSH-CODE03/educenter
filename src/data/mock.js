// Mock data layer. Replace these with REST API calls (see src/services/api.js).

export const students = [
  { id: "STU-1001", name: "Aarav Sharma", contact: "+91 98200 11223", email: "aarav@example.com", course: "Class 10 Science", batch: "Batch A - Morning", joiningDate: "2025-04-12", totalFee: 24000, paid: 24000, dueDate: "2025-07-05", attendance: 94 },
  { id: "STU-1002", name: "Diya Patel", contact: "+91 98111 44556", email: "diya@example.com", course: "Class 12 Commerce", batch: "Batch C - Evening", joiningDate: "2025-05-02", totalFee: 30000, paid: 18000, dueDate: "2025-08-15", attendance: 88 },
  { id: "STU-1003", name: "Kabir Verma", contact: "+91 99880 77661", email: "kabir@example.com", course: "Class 10 Maths", batch: "Batch B - Afternoon", joiningDate: "2025-03-21", totalFee: 20000, paid: 0, dueDate: "2025-07-30", attendance: 72 },
  { id: "STU-1004", name: "Ishita Nair", contact: "+91 90045 22118", email: "ishita@example.com", course: "Class 12 Science", batch: "Batch D - Morning", joiningDate: "2025-06-01", totalFee: 34000, paid: 34000, dueDate: "2025-09-01", attendance: 97 },
  { id: "STU-1005", name: "Rohan Gupta", contact: "+91 88770 65432", email: "rohan@example.com", course: "Class 11 Commerce", batch: "Batch C - Evening", joiningDate: "2025-02-14", totalFee: 26000, paid: 13000, dueDate: "2025-08-05", attendance: 81 },
  { id: "STU-1006", name: "Ananya Singh", contact: "+91 97654 32109", email: "ananya@example.com", course: "Class 10 Science", batch: "Batch A - Morning", joiningDate: "2025-04-18", totalFee: 24000, paid: 24000, dueDate: "2025-07-05", attendance: 91 },
  { id: "STU-1007", name: "Vivaan Joshi", contact: "+91 93456 78012", email: "vivaan@example.com", course: "Class 12 Commerce", batch: "Batch C - Evening", joiningDate: "2025-01-09", totalFee: 30000, paid: 22000, dueDate: "2025-07-20", attendance: 76 },
  { id: "STU-1008", name: "Meera Iyer", contact: "+91 91234 56780", email: "meera@example.com", course: "Class 11 Science", batch: "Batch B - Afternoon", joiningDate: "2025-05-27", totalFee: 28000, paid: 0, dueDate: "2025-08-28", attendance: 85 },
];

export const teachers = [
  { id: "TCH-01", name: "Rakesh Menon", subject: "Physics", batches: ["Batch A - Morning", "Batch D - Morning"], contact: "+91 98765 43210", email: "rakesh@educentre.in", status: "Active" },
  { id: "TCH-02", name: "Sunita Deshmukh", subject: "Mathematics", batches: ["Batch B - Afternoon"], contact: "+91 99001 23456", email: "sunita@educentre.in", status: "Active" },
  { id: "TCH-03", name: "Imran Qureshi", subject: "Accountancy", batches: ["Batch C - Evening"], contact: "+91 90909 11223", email: "imran@educentre.in", status: "Active" },
  { id: "TCH-04", name: "Kavita Rao", subject: "Chemistry", batches: ["Batch A - Morning", "Batch B - Afternoon"], contact: "+91 88991 22334", email: "kavita@educentre.in", status: "On Leave" },
  { id: "TCH-05", name: "Amit Bansal", subject: "Economics", batches: ["Batch C - Evening"], contact: "+91 97000 55443", email: "amit@educentre.in", status: "Active" },
];

export const courses = [
  { id: "CRS-01", name: "Class 10 Science", duration: "10 months", students: 62, teachers: ["Rakesh Menon", "Kavita Rao"], fee: 24000, status: "Active" },
  { id: "CRS-02", name: "Class 10 Maths", duration: "8 months", students: 41, teachers: ["Sunita Deshmukh"], fee: 20000, status: "Active" },
  { id: "CRS-03", name: "Class 11 Science", duration: "12 months", students: 35, teachers: ["Rakesh Menon"], fee: 28000, status: "Active" },
  { id: "CRS-04", name: "Class 11 Commerce", duration: "12 months", students: 28, teachers: ["Amit Bansal"], fee: 26000, status: "Active" },
  { id: "CRS-05", name: "Class 12 Science", duration: "12 months", students: 44, teachers: ["Rakesh Menon", "Kavita Rao"], fee: 34000, status: "Active" },
  { id: "CRS-06", name: "Class 12 Commerce", duration: "12 months", students: 38, teachers: ["Imran Qureshi", "Amit Bansal"], fee: 30000, status: "Closed" },
];

export const batches = [
  { id: "BCH-A", name: "Batch A - Morning", course: "Class 10 Science", teacher: "Rakesh Menon", timing: "7:00 AM – 9:00 AM", students: 32, room: "Room 1", status: "Active" },
  { id: "BCH-B", name: "Batch B - Afternoon", course: "Class 10 Maths", teacher: "Sunita Deshmukh", timing: "1:00 PM – 3:00 PM", students: 28, room: "Room 2", status: "Active" },
  { id: "BCH-C", name: "Batch C - Evening", course: "Class 12 Commerce", teacher: "Imran Qureshi", timing: "5:30 PM – 7:30 PM", students: 30, room: "Room 3", status: "Active" },
  { id: "BCH-D", name: "Batch D - Morning", course: "Class 12 Science", teacher: "Rakesh Menon", timing: "8:00 AM – 10:00 AM", students: 26, room: "Room 1", status: "Full" },
];

export const materials = [
  { id: "MAT-01", title: "Light – Reflection & Refraction Notes", subject: "Physics", batch: "Batch A - Morning", uploadedDate: "2026-07-28", type: "PDF", size: "2.4 MB" },
  { id: "MAT-02", title: "Quadratic Equations Worksheet", subject: "Mathematics", batch: "Batch B - Afternoon", uploadedDate: "2026-07-26", type: "PDF", size: "860 KB" },
  { id: "MAT-03", title: "Partnership Accounts Assignment", subject: "Accountancy", batch: "Batch C - Evening", uploadedDate: "2026-07-24", type: "DOCX", size: "410 KB" },
  { id: "MAT-04", title: "Organic Chemistry Revision Sheet", subject: "Chemistry", batch: "Batch D - Morning", uploadedDate: "2026-07-21", type: "PDF", size: "1.8 MB" },
  { id: "MAT-05", title: "Micro Economics Class Notes", subject: "Economics", batch: "Batch C - Evening", uploadedDate: "2026-07-18", type: "PPTX", size: "3.1 MB" },
];

export const announcements = [
  { id: "ANN-01", title: "Monthly test on 12th August", message: "All Class 10 batches will have their monthly assessment on 12th August. Syllabus: chapters 1–4.", audience: "Students", date: "2026-08-02", author: "Admin Office" },
  { id: "ANN-02", title: "Holiday – Independence Day", message: "The centre will remain closed on 15th August. Evening batches resume on 16th August.", audience: "All", date: "2026-08-01", author: "Admin Office" },
  { id: "ANN-03", title: "Batch C class rescheduled", message: "Accountancy class of Batch C on Friday shifts to 6:30 PM due to a faculty meeting.", audience: "Batch C - Evening", date: "2026-07-29", author: "Imran Qureshi" },
  { id: "ANN-04", title: "Fee reminder for July cycle", message: "Parents are requested to clear pending fees before 5th August to avoid late charges.", audience: "Parents", date: "2026-07-27", author: "Admin Office" },
];

export const attendanceTrend = [
  { month: "Feb", present: 88, absent: 12 },
  { month: "Mar", present: 91, absent: 9 },
  { month: "Apr", present: 86, absent: 14 },
  { month: "May", present: 93, absent: 7 },
  { month: "Jun", present: 90, absent: 10 },
  { month: "Jul", present: 94, absent: 6 },
];

export const feeTrend = [
  { month: "Feb", collected: 182000, pending: 42000 },
  { month: "Mar", collected: 204000, pending: 36000 },
  { month: "Apr", collected: 226000, pending: 51000 },
  { month: "May", collected: 198000, pending: 44000 },
  { month: "Jun", collected: 241000, pending: 39000 },
  { month: "Jul", collected: 263000, pending: 48500 },
];

export const recentPayments = [
  { id: "PAY-9001", student: "Ishita Nair", amount: 17000, mode: "UPI", date: "2026-08-02" },
  { id: "PAY-9002", student: "Aarav Sharma", amount: 12000, mode: "Cash", date: "2026-08-01" },
  { id: "PAY-9003", student: "Vivaan Joshi", amount: 8000, mode: "Bank Transfer", date: "2026-07-31" },
  { id: "PAY-9004", student: "Ananya Singh", amount: 12000, mode: "UPI", date: "2026-07-30" },
];

export const attendanceHistory = [
  { date: "2026-08-03", batch: "Batch A - Morning", present: 30, absent: 2, percentage: 94 },
  { date: "2026-08-02", batch: "Batch A - Morning", present: 28, absent: 4, percentage: 88 },
  { date: "2026-08-02", batch: "Batch B - Afternoon", present: 25, absent: 3, percentage: 89 },
  { date: "2026-08-01", batch: "Batch C - Evening", present: 27, absent: 3, percentage: 90 },
  { date: "2026-07-31", batch: "Batch A - Morning", present: 31, absent: 1, percentage: 97 },
];

export const studentAttendanceLog = [
  { date: "2026-08-03", subject: "Physics", status: "Present" },
  { date: "2026-08-02", subject: "Chemistry", status: "Present" },
  { date: "2026-08-01", subject: "Physics", status: "Absent" },
  { date: "2026-07-31", subject: "Maths", status: "Present" },
  { date: "2026-07-30", subject: "Physics", status: "Present" },
  { date: "2026-07-29", subject: "Chemistry", status: "Present" },
];

export function feeStatus(student) {
  const pending = student.totalFee - student.paid;
  if (pending <= 0) return "Paid";
  if (student.paid > 0) return "Partially Paid";
  return "Pending";
}

export const currentStudent = students[0];
