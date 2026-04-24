import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const GoogleLoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse query params from URL
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");
    const email = searchParams.get("email");

    if (userId && role) {
      // Store in localStorage
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      if (email) {
          localStorage.setItem("email", email);
      }

      // Redirect based on role
      if (role === "ADMIN") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } else {
      // Missing expected data, fallback to login
      navigate("/login", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
      />
      <p className="ml-4 font-titillium font-semibold text-primary">Authenticating...</p>
    </div>
  );
};

export default GoogleLoginSuccess;
