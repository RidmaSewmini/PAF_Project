import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Dashboard from "./modules/user/pages/Dashboard";
import UpdateProfile from "./modules/user/pages/UpdateProfile";
import Register from "./modules/user/pages/Register";
import Login from "./modules/user/pages/Login";
import UserProfile from "./modules/user/pages/UserProfile";
import ForgotPassword from "./modules/user/pages/ForgotPassword";
import ResetPassword from "./modules/user/pages/ResetPassword";
import VerifyEmailPage from "./modules/user/pages/VerifyEmailPage";
import GoogleLoginSuccess from "./modules/user/pages/GoogleLoginSuccess";
import AdminLogin from "./modules/admin/pages/AdminLogin";
import AdminDashboard from "./modules/admin/pages/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import UserProfilePage from "./modules/user/pages/UserProfilePage";
import AdminProfilePage from "./modules/admin/pages/AdminProfilePage";
import NotificationsPage from "./modules/notification/pages/NotificationsPage";
import AdminUsersPage from "./modules/admin/pages/AdminUsersPage";
import AdminAuditPage from "./modules/admin/pages/AdminAuditPage";
import AdminSettingsPage from "./modules/admin/pages/AdminSettingsPage";
import FacilityList from "./modules/facility/pages/FacilityList";
import FacilityForm from "./modules/facility/pages/FacilityForm";
import StudentFacilityList from "./modules/facility/pages/StudentFacilityList";
import BookingForm from "./modules/booking/pages/BookingForm";
import MyBookings from "./modules/booking/pages/MyBookings";
import AdminBookings from "./modules/booking/pages/AdminBookings";

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
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* ── Facility routes ── */}
            <Route path="/facilities" element={<FacilityList />} />
            <Route path="/facilities/new" element={<FacilityForm />} />
            <Route path="/facilities/edit/:id" element={<FacilityForm />} />
            <Route path="/student/facilities" element={<StudentFacilityList />} />
            <Route path="/admin/facilities" element={<ProtectedAdminRoute><FacilityList /></ProtectedAdminRoute>} />
            <Route path="/admin/facilities/new" element={<ProtectedAdminRoute><FacilityForm /></ProtectedAdminRoute>} />
            <Route path="/admin/facilities/edit/:id" element={<ProtectedAdminRoute><FacilityForm /></ProtectedAdminRoute>} />

            {/* ── Booking routes ── */}
            <Route path="/bookings/new" element={<BookingForm />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/admin/bookings" element={<ProtectedAdminRoute><AdminBookings /></ProtectedAdminRoute>} />

            {/* ── Auth routes ── */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/google-login-success" element={<GoogleLoginSuccess />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />

            {/* ── Inner page in MainLayout ── */}
            <Route element={<MainLayout />}>
              <Route path="/updateProfile/:id" element={<UpdateProfile />} />
            </Route>

            {/* ── Profile & notifications routes ── */}
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/admin/notifications" element={<ProtectedAdminRoute><NotificationsPage /></ProtectedAdminRoute>} />
            <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsersPage /></ProtectedAdminRoute>} />
            <Route path="/admin/audit" element={<ProtectedAdminRoute><AdminAuditPage /></ProtectedAdminRoute>} />
            <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettingsPage /></ProtectedAdminRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;