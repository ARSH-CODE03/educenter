import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import { AuthProvider } from "@/hooks/useAuth";
import { DashboardLayout } from "@/layouts/DashboardLayout";

// Public pages
import LandingPage from "@/pages/Landing/LandingPage";
import FeaturesPage from "@/pages/Landing/FeaturesPage";
import HowItWorksPage from "@/pages/Landing/HowItWorksPage";
import RolesPage from "@/pages/Landing/RolesPage";
import DashboardPreviewPage from "@/pages/Landing/DashboardPreviewPage";
import AboutPage from "@/pages/Landing/AboutPage";
import ContactPage from "@/pages/Landing/ContactPage";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";

// Admin
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import StudentsPage from "@/pages/Admin/StudentsPage";
import TeachersPage from "@/pages/Admin/TeachersPage";
import CoursesPage from "@/pages/Admin/CoursesPage";
import BatchesPage from "@/pages/Admin/BatchesPage";
import AttendanceOverview from "@/pages/Admin/AttendanceOverview";
import FeesPage from "@/pages/Admin/FeesPage";
import ReportsPage from "@/pages/Admin/ReportsPage";

// Teacher
import TeacherDashboard from "@/pages/Teacher/TeacherDashboard";
import MyBatches from "@/pages/Teacher/MyBatches";
import TeacherStudents from "@/pages/Teacher/TeacherStudents";
import MarkAttendance from "@/pages/Teacher/MarkAttendance";
import AttendanceHistoryPage from "@/pages/Teacher/AttendanceHistoryPage";
import AssignmentsPage from "@/pages/Teacher/AssignmentsPage";

// Student
import StudentDashboard from "@/pages/Student/StudentDashboard";
import MyBatch from "@/pages/Student/MyBatch";
import MyAttendance from "@/pages/Student/MyAttendance";
import FeeStatus from "@/pages/Student/FeeStatus";

// Shared
import MaterialPage from "@/pages/Shared/MaterialPage";
import AnnouncementsPage from "@/pages/Shared/AnnouncementsPage";
import ProfilePage from "@/pages/Shared/ProfilePage";

function RoleLayout({ role }) {
  return (
    <DashboardLayout role={role}>
      <Outlet />
    </DashboardLayout>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Go home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/dashboard-preview" element={<DashboardPreviewPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin */}
          <Route path="/admin" element={<RoleLayout role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<StudentsPage />} />
            <Route path="teachers" element={<TeachersPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="batches" element={<BatchesPage />} />
            <Route path="attendance" element={<AttendanceOverview />} />
            <Route path="fees" element={<FeesPage />} />
            <Route path="material" element={<MaterialPage canUpload />} />
            <Route path="announcements" element={<AnnouncementsPage canCreate />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Teacher */}
          <Route path="/teacher" element={<RoleLayout role="teacher" />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="batches" element={<MyBatches />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="attendance" element={<MarkAttendance />} />
            <Route path="history" element={<AttendanceHistoryPage />} />
            <Route path="material" element={<MaterialPage canUpload />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route
              path="announcements"
              element={<AnnouncementsPage canCreate title="Academic Announcements" />}
            />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Student */}
          <Route path="/student" element={<RoleLayout role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="batch" element={<MyBatch />} />
            <Route path="attendance" element={<MyAttendance />} />
            <Route path="fees" element={<FeeStatus />} />
            <Route path="material" element={<MaterialPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
