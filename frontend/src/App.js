import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout (wraps UpdateProfile — uses landing Navbar/Footer)
import MainLayout from "./layouts/MainLayout";

// Pages — standalone landing
import Home from "./pages/Home";

// Pages — standalone with DashboardNavbar+Footer
import Dashboard from "./modules/user/pages/Dashboard";

// ── User module pages (src/modules/user/pages/) ────────────────────────────
import UpdateProfile from "./modules/user/pages/UpdateProfile";
import Register from "./modules/user/pages/Register";
import Login from "./modules/user/pages/Login";
import ForgotPassword from "./modules/user/pages/ForgotPassword";
import ResetPassword from "./modules/user/pages/ResetPassword";
import VerifyEmailPage from "./modules/user/pages/VerifyEmailPage";
import GoogleLoginSuccess from "./modules/user/pages/GoogleLoginSuccess";

import AdminLogin from "./modules/admin/pages/AdminLogin";
import AdminDashboard from "./modules/admin/pages/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProfilePage from "./modules/user/pages/UserProfilePage";
import AdminProfilePage from "./modules/admin/pages/AdminProfilePage";
import NotificationsPage from "./modules/notification/pages/NotificationsPage";
import AdminUsersPage from "./modules/admin/pages/AdminUsersPage";
import AdminAuditPage from "./modules/admin/pages/AdminAuditPage";
import AdminSettingsPage from "./modules/admin/pages/AdminSettingsPage";

// ── Ticket module pages ────────────────────────────────────────────────────
import TicketDashboard from "./modules/ticket/pages/TicketDashboard";
import IncidentForm from "./modules/ticket/component/IncidentForm";

import "./App.css";

import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Toaster position="top-right" />
        <Router>
          <Routes>
            {/* ── Landing page (standalone landing Navbar) ───────────────── */}
            <Route path="/" element={<Home />} />

            {/* ── App pages (standalone — use DashboardNavbar + DashboardFooter) */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* ── Inner page still in MainLayout (landing Navbar) ───────── */}
            <Route element={<MainLayout />}>
              <Route path="/updateProfile/:id" element={<UpdateProfile />} />
            </Route>

            {/* ── Auth routes (full-screen standalone) ──────────────────── */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/google-login-success" element={<GoogleLoginSuccess />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />

            {/* ── Extracted modern profile routes ────────────────────────────── */}
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/admin/notifications" element={<ProtectedAdminRoute><NotificationsPage /></ProtectedAdminRoute>} />
            <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsersPage /></ProtectedAdminRoute>} />
            <Route path="/admin/audit" element={<ProtectedAdminRoute><AdminAuditPage /></ProtectedAdminRoute>} />
            <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettingsPage /></ProtectedAdminRoute>} />

            {/* ── Ticket module routes ───────────────────────────────────────── */}
            <Route path="/tickets" element={<ProtectedRoute><TicketDashboard /></ProtectedRoute>} />
            <Route path="/report-incident" element={<ProtectedRoute><IncidentForm /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;