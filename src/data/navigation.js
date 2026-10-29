import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  CalendarCheck,
  Wallet,
  FolderOpen,
  Megaphone,
  BarChart3,
  UserCircle,
  ClipboardList,
  History,
  FileText,
} from "lucide-react";

export const navigation = {
  admin: [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { label: "Students", to: "/admin/students", icon: Users },
    { label: "Teachers", to: "/admin/teachers", icon: GraduationCap },
    { label: "Courses", to: "/admin/courses", icon: BookOpen },
    { label: "Batches", to: "/admin/batches", icon: Layers },
    { label: "Attendance", to: "/admin/attendance", icon: CalendarCheck },
    { label: "Fees", to: "/admin/fees", icon: Wallet },
    { label: "Study Material", to: "/admin/material", icon: FolderOpen },
    { label: "Announcements", to: "/admin/announcements", icon: Megaphone },
    { label: "Reports", to: "/admin/reports", icon: BarChart3 },
    { label: "Profile", to: "/admin/profile", icon: UserCircle },
  ],
  teacher: [
    { label: "Dashboard", to: "/teacher", icon: LayoutDashboard },
    { label: "My Batches", to: "/teacher/batches", icon: Layers },
    { label: "Students", to: "/teacher/students", icon: Users },
    { label: "Mark Attendance", to: "/teacher/attendance", icon: ClipboardList },
    { label: "Attendance History", to: "/teacher/history", icon: History },
    { label: "Study Material", to: "/teacher/material", icon: FolderOpen },
    { label: "Assignments / Notes", to: "/teacher/assignments", icon: FileText },
    { label: "Announcements", to: "/teacher/announcements", icon: Megaphone },
    { label: "Profile", to: "/teacher/profile", icon: UserCircle },
  ],
  student: [
    { label: "Dashboard", to: "/student", icon: LayoutDashboard },
    { label: "My Batch", to: "/student/batch", icon: Layers },
    { label: "My Attendance", to: "/student/attendance", icon: CalendarCheck },
    { label: "Fee Status", to: "/student/fees", icon: Wallet },
    { label: "Study Material", to: "/student/material", icon: FolderOpen },
    { label: "Announcements", to: "/student/announcements", icon: Megaphone },
    { label: "Profile", to: "/student/profile", icon: UserCircle },
  ],
};

export const roleLabel = {
  admin: "Administrator",
  teacher: "Teacher",
  student: "Student",
};
