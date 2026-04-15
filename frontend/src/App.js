import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout (wraps UpdateProfile — uses landing Navbar/Footer)
import MainLayout from "./layouts/MainLayout";

// Pages — standalone landing
import Home from "./pages/Home";

// Pages — standalone with DashboardNavbar+Footer
import Dashboard from "./pages/Dashboard";

// ── User module pages ──────────────────────────────────────────────────────
import UserProfile from "./modules/user/pages/UserProfile";
import UpdateProfile from "./modules/user/pages/UpdateProfile";
import Register from "./modules/user/pages/Register";
import Login from "./modules/user/pages/Login";

// ── Facility module pages ──────────────────────────────────────────────────
import FacilityList from "./modules/facility/pages/FacilityList";
import FacilityForm from "./modules/facility/pages/FacilityForm";

// ── Booking module pages ───────────────────────────────────────────────────
import BookingForm from "./modules/booking/pages/BookingForm";
import MyBookings from "./modules/booking/pages/MyBookings";
import AdminBookings from "./modules/booking/pages/AdminBookings";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Landing ───────────────────────────────────────────────── */}
        <Route path="/" element={<Home />} />

        {/* ── App pages ─────────────────────────────────────────────── */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userProfile" element={<UserProfile />} />

        {/* ── Facility routes ───────────────────────────────────────── */}
        <Route path="/facilities" element={<FacilityList />} />
        <Route path="/facilities/new" element={<FacilityForm />} />
        <Route
          path="/facilities/edit/:id"
          element={<FacilityForm />}
        />

        {/* ── Booking routes ────────────────────────────────────────── */}
        <Route path="/bookings/new" element={<BookingForm />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />

        {/* ── Inner pages in MainLayout ─────────────────────────────── */}
        <Route element={<MainLayout />}>
          <Route path="/updateProfile/:id" element={<UpdateProfile />} />
        </Route>

        {/* ── Auth ──────────────────────────────────────────────────── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;