import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { User, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

// ─── Animated input field ─────────────────────────────────────────────────────
const FormInput = ({
  id,
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  icon,
  required,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-on-surface/70 mb-1.5">
        {label}
      </label>
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 0 0 3px rgba(91,60,221,0.22)"
            : "0 0 0 0px rgba(91,60,221,0)",
        }}
        transition={{ duration: 0.2 }}
        className="relative rounded-full"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/35 pointer-events-none z-10">
          {icon}
        </div>
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          required={required}
          autoComplete={
            type === "password" ? "new-password" : type === "email" ? "email" : "username"
          }
          className="w-full bg-white/80 rounded-full py-3.5 pl-11 pr-5 text-sm text-on-surface placeholder:text-on-surface/30 outline-none border border-transparent transition-all duration-200 focus:bg-white focus:border-primary/15"
        />
      </motion.div>
    </div>
  );
};

// ─── Avatar stack ─────────────────────────────────────────────────────────────
const avatarUrls = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80",
];

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("error") === "already_exists") {
      setError("Account already exists. Please login.");
    }
  }, [location]);

  const { name, email, password } = user;

  const getPasswordStrength = (currPassword) => {
    if (!currPassword) return "";
    let score = 0;
    if (currPassword.length >= 8) score++;
    if (/[A-Z]/.test(currPassword)) score++;
    if (/\d/.test(currPassword)) score++;
    if (/[@$!%*?&]/.test(currPassword)) score++;

    if (score <= 1) return "Weak";
    if (score === 2 || score === 3) return "Medium";
    return "Strong";
  };

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    if (e.target.name === "password") {
      setPasswordStrength(getPasswordStrength(e.target.value));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!name.trim() || !email.trim() || !password.trim()) {
      errors.general = "All fields are required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.(com)$/;
    if (email && !emailRegex.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (password && getPasswordStrength(password) === "Weak") {
      errors.password =
        "Password is too weak. Use at least 8 characters with uppercase, number, or special character.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/users", user);
      navigate(`/verify-email?email=${encodeURIComponent(user.email)}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12 bg-brand-gradient">
      {/* ── Decorative background blobs ─────────────────────────────────── */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-120px] left-[-120px] w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.08)", filter: "blur(60px)" }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[-100px] right-[-80px] w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "rgb(var(--cf-accent) / 0.22)", filter: "blur(70px)" }}
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-[10%] w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.05)", filter: "blur(40px)" }}
      />

      {/* ── Main card ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-3xl overflow-hidden"
        style={{
          background: "rgba(232, 228, 253, 0.82)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          boxShadow:
            "0 32px 80px rgba(91,60,221,0.35), 0 8px 24px rgba(91,60,221,0.18), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
      >
        <div className="px-8 pt-10 pb-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="flex items-center justify-center gap-2 mb-7"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
            <span className="font-headline font-extrabold text-xl text-on-surface tracking-tight">
              CampusFlow
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-center mb-7"
          >
            <h1 className="font-headline text-[2rem] font-extrabold text-on-surface tracking-tight leading-tight mb-2">
              Create Account
            </h1>
            <p className="text-sm text-on-surface/55">
              Join the <span className="editorial-text text-primary text-[15px]">academic futurist</span>{" "}
              community
            </p>
          </motion.div>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-600 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {formErrors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-2xl mb-4">
              {formErrors.general}
            </div>
          )}

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={onSubmit}
            noValidate
            className="space-y-4"
          >
            <FormInput
              id="name"
              label="Username"
              type="text"
              name="name"
              value={name}
              onChange={onInputChange}
              placeholder="Choose a unique handle"
              required
              icon={<User className="w-4 h-4" />}
            />

            <div>
              <FormInput
                id="email"
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={onInputChange}
                placeholder="Your institutional email"
                required
                icon={<Mail className="w-4 h-4" />}
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1 ml-2">{formErrors.email}</p>
              )}
            </div>

            <div>
              <FormInput
                id="password"
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={onInputChange}
                placeholder="At least 8 characters"
                required
                icon={<Lock className="w-4 h-4" />}
              />

              {password && (
                <div className="mt-2 ml-1">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength === "Weak"
                          ? "w-1/3 bg-red-500"
                          : passwordStrength === "Medium"
                            ? "w-2/3 bg-yellow-500"
                            : passwordStrength === "Strong"
                              ? "w-full bg-green-500"
                              : "w-0"
                      }`}
                    />
                  </div>
                  <p
                    className={`text-xs mt-1 font-medium ${
                      passwordStrength === "Weak"
                        ? "text-red-500"
                        : passwordStrength === "Medium"
                          ? "text-yellow-600"
                          : passwordStrength === "Strong"
                            ? "text-green-600"
                            : ""
                    }`}
                  >
                    {passwordStrength && `Password Strength: ${passwordStrength}`}
                  </p>
                  {passwordStrength === "Medium" && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Medium password is acceptable but consider making it stronger.
                    </p>
                  )}
                </div>
              )}
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1 ml-2">{formErrors.password}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group w-full mt-2 py-3.5 rounded-full bg-brand-gradient text-white font-semibold text-sm shadow-card hover:shadow-card-hover transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Creating Account…
                </>
              ) : (
                <>
                  Register
                  <motion.div animate={{ x: 0 }} whileHover={{ x: 4 }}>
                    <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                  </motion.div>
                </>
              )}
            </motion.button>

            <div className="relative flex items-center py-2 mt-4">
              <div className="flex-grow border-t border-surface-container-highest/60"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-on-surface/40 uppercase tracking-widest">
                Or
              </span>
              <div className="flex-grow border-t border-surface-container-highest/60"></div>
            </div>

            <motion.button
              type="button"
              onClick={() => {
                window.location.href =
                  "http://localhost:8080/oauth2/authorization/google?mode=register";
              }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-full bg-white border border-surface-container-highest text-on-surface font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2.5 mt-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Register with Google
            </motion.button>
          </motion.form>

          {/* Login link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-on-surface/55 mt-6 mb-5"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-primary hover:text-primary-container hover:underline transition-all duration-200"
            >
              Log In
            </Link>
          </motion.p>

          {/* Footer links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-5"
          >
            {["Privacy Policy", "Terms of Service"].map((link) => (
              <Link
                key={link}
                to="#"
                className="text-[11px] text-on-surface/35 hover:text-primary transition-colors duration-200"
              >
                {link}
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Bottom social proof bar ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.55 }}
        className="absolute bottom-6 left-0 right-0 flex items-center justify-between px-8 sm:px-12"
      >
        <div className="flex items-center">
          {avatarUrls.map((url, i) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + i * 0.08 }}
              className="w-8 h-8 rounded-full border-2 border-white/50 overflow-hidden -ml-2 first:ml-0 shadow-md"
              style={{ zIndex: avatarUrls.length - i }}
            >
              <img
                src={url}
                alt={`Educator ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
          Join 40,000+ Educators
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
