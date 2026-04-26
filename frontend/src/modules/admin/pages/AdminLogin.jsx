import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Mail, Lock, EyeOff, Eye, AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

// ─── Floating notification card on the left panel ────────────────────────────
const NotificationCard = ({ icon, tag, title, body, delay, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 28, scale: 0.94 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
    style={{ animation: `float ${4.5 + delay}s ease-in-out ${delay * 0.6}s infinite` }}
    className={`absolute glass-panel bg-white/90 rounded-2xl p-4 shadow-card min-w-[220px] max-w-[260px] ${className}`}
  >
    <div className="flex items-center gap-2 mb-1.5">
      <div className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center flex-shrink-0">
        <span className="text-sm">{icon}</span>
      </div>
      <span className="text-[9px] font-bold tracking-widest text-on-surface/40 uppercase">
        {tag}
      </span>
    </div>
    <p className="font-titillium font-bold text-xs text-on-surface leading-tight mb-1">
      {title}
    </p>
    <p className="text-[11px] text-on-surface/55 leading-snug">{body}</p>
  </motion.div>
);

// ─── Animated input field ─────────────────────────────────────────────────────
const FormInput = ({ id, label, type, value, onChange, placeholder, icon, rightSlot, required }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-sm font-medium text-on-surface/70">
          {label}
        </label>
        {rightSlot}
      </div>
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 0 0 3px rgba(91,60,221,0.18), 0 2px 8px rgba(91,60,221,0.08)"
            : "0 0 0 0px rgba(91,60,221,0)",
        }}
        transition={{ duration: 0.2 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/35 pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          autoComplete={type === "password" ? "current-password" : "email"}
          className="w-full bg-surface-container-low border border-transparent rounded-2xl py-3.5 pl-11 pr-4 text-sm text-on-surface placeholder:text-on-surface/30 outline-none transition-all duration-200 focus:bg-white focus:border-primary/20"
        />
      </motion.div>
    </div>
  );
};

// ─── Main Login Component ─────────────────────────────────────────────────────
function AdminLogin() {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── Backend call — identical logic to original, uses existing endpoint ──────
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loginData = { email, password };

    try {
      const response = await axios.post("http://localhost:8080/admin/login", loginData);

      console.log(response.data);

      if (response.data.id) {
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("role", "ADMIN");
        if (rememberMe) localStorage.setItem("rememberMe", "true");
        // Sync AuthContext so user is not null when ProtectedRoute checks
        await fetchUser();
        // Navigate to dashboard after successful login
        navigate("/admin-dashboard");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  // ── Page-level animation variants ──────────────────────────────────────────
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const panelVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex overflow-hidden"
    >
      {/* ═══════════════════════════════════════════════════════
          LEFT PANEL — Branding + Campus Visual
      ═══════════════════════════════════════════════════════ */}
      <motion.div
        variants={panelVariants}
        className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col justify-between p-10 overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #5b3cdd 0%, #7459f7 55%, #a12e70 100%)",
        }}
      >
        {/* Campus building background image */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=60')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        />

        {/* Gradient overlay over image */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(91,60,221,0.85) 0%, rgba(116,89,247,0.70) 50%, rgba(91,60,221,0.92) 100%)",
          }}
        />

        {/* Decorative blobs */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.12)", filter: "blur(40px)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "rgba(161,46,112,0.3)", filter: "blur(50px)" }}
        />

        {/* Content — relative layer above image */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3L1 9l11 6 11-6-11-6zM1 17l11 6 11-6M1 13l11 6 11-6"
                />
              </svg>
            </div>
            <span className="font-titillium font-bold text-base text-white tracking-tight">
              CampusFlow
            </span>
          </div>

          {/* Hero text — vertically centered */}
          <div className="flex-1 flex flex-col justify-center mt-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-titillium font-extrabold text-4xl xl:text-5xl text-white leading-[1.15] mb-5"
            >
              Welcome Back to{" "}
              <span className="font-aldrich block text-white/90 mt-1">CampusFlow</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-white/65 text-sm leading-relaxed max-w-xs"
            >
              Manage bookings, track resources, and stay connected with your campus.
              Your all-in-one{" "}
              <em className="font-aldrich not-italic text-white/85">academic futurist</em> hub.
            </motion.p>
          </div>

          {/* Floating notification cards */}
          <div className="relative h-56 mt-auto">
            <NotificationCard
              icon="✅"
              tag="Notification"
              title="Booking Approved"
              body="Conference Room 402 is now reserved for your Seminar."
              delay={0.7}
              className="left-0 bottom-24"
            />
            <NotificationCard
              icon="🏠"
              tag="Update"
              title="Room Available"
              body="Study Hall B has 12 vacancies. Tap to navigate."
              delay={1.1}
              className="left-20 bottom-0"
            />
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          RIGHT PANEL — Login Form
      ═══════════════════════════════════════════════════════ */}
      <motion.div
        variants={formVariants}
        className="flex-1 flex flex-col bg-surface"
      >
        {/* Mobile top logo strip */}
        <div className="lg:hidden flex items-center gap-2 px-6 py-5 bg-brand-gradient">
          <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3L1 9l11 6 11-6-11-6zM1 17l11 6 11-6M1 13l11 6 11-6"
              />
            </svg>
          </div>
          <span className="font-titillium font-bold text-base text-white tracking-tight">
            CampusFlow
          </span>
        </div>

        {/* Form area — centered vertically */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Page heading */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="font-titillium text-3xl font-extrabold text-on-surface tracking-tight mb-1.5">
                Admin Sign In
              </h1>
              <p className="text-sm text-on-surface/55">
                Access the administrative panel
              </p>
            </motion.div>

            {/* Glass form card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="bg-white rounded-3xl shadow-card p-7 mb-6"
            >
              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-xs text-red-600 font-medium">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={onSubmit} noValidate className="space-y-5">
                {/* Email input */}
                <FormInput
                  id="email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="campus@university.edu"
                  required
                  icon={<Mail className="w-4 h-4" />}
                />

                {/* Password input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-on-surface/70">
                      Password
                    </label>
                    <Link
                      to="#"
                      className="text-xs font-semibold text-primary hover:text-primary-container transition-colors duration-200"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <motion.div
                    className="relative rounded-2xl overflow-hidden"
                  >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/35 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full bg-surface-container-low border border-transparent rounded-2xl py-3.5 pl-11 pr-12 text-sm text-on-surface placeholder:text-on-surface/30 outline-none transition-all duration-200 focus:bg-white focus:border-primary/20 focus:shadow-[0_0_0_3px_rgba(91,60,221,0.15)]"
                    />
                    {/* Show/hide toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-on-surface/35 hover:text-primary transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </motion.div>
                </div>

                {/* Remember me checkbox */}
                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-md border-2 border-surface-container-highest bg-surface-container-low peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 flex items-center justify-center">
                      {rememberMe && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-on-surface/60 group-hover:text-on-surface/80 transition-colors select-none">
                    Remember me for 30 days
                  </span>
                </label>

                {/* Login button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-2xl bg-brand-gradient text-white font-semibold text-sm shadow-card hover:shadow-card-hover transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Signing In…
                    </>
                  ) : (
                    "Login"
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Register link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-sm text-on-surface/55 mb-10"
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-primary hover:text-primary-container transition-colors duration-200"
              >
                Register
              </Link>
            </motion.p>

            {/* Footer links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center gap-6"
            >
              {["Privacy Policy", "Terms of Service", "Help Center"].map((link) => (
                <Link
                  key={link}
                  to="#"
                  className="text-[10px] font-semibold tracking-widest text-on-surface/35 hover:text-primary uppercase transition-colors duration-200"
                >
                  {link}
                </Link>
              ))}
            </motion.div>
          </div>
        </div>

        {/* SSO badge — fixed bottom-right */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="fixed bottom-6 right-6 glass-panel bg-white/95 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-card"
        >
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={1.8} />
          </div>
          <div>
            <p className="font-titillium font-bold text-xs text-on-surface">SSO Enabled</p>
            <p className="text-[10px] text-on-surface/45">CampusFlow uses secure 2FA</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default AdminLogin;