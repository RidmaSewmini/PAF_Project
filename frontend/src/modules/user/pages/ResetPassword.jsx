import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function ResetPassword() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlToken = params.get("token") || "";

  const [token, setToken] = useState(urlToken);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !newPassword) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await axios.post("http://localhost:8080/users/reset-password/confirm", { token, newPassword });
      setStatus({ type: "success", message: res.data.message });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Invalid or expired token" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2rem] p-8 sm:p-10 shadow-card"
      >
        <div className="text-center mb-8">
          <h2 className="font-titillium font-extrabold text-2xl text-on-surface tracking-tight mb-2">
            Reset Password
          </h2>
          <p className="text-sm text-on-surface/60">
            Enter your token and set a new password.
          </p>
        </div>

        <AnimatePresence>
          {status && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className={`flex items-center gap-2 p-4 rounded-2xl border ${status.type === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <p className={`text-xs font-semibold ${status.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                  {status.message}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="token" className="text-[10px] font-bold tracking-[0.14em] text-on-surface/40 uppercase pl-1">
              Reset Token
            </label>
            <input
              id="token"
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your token"
              required
              className="w-full bg-surface-container-low border border-transparent rounded-2xl py-3.5 pl-4 pr-4 text-sm text-on-surface placeholder:text-on-surface/30 outline-none transition-all duration-200 focus:bg-white focus:border-primary/20 focus:shadow-[0_0_0_3px_rgba(91,60,221,0.15)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="newPassword" className="text-[10px] font-bold tracking-[0.14em] text-on-surface/40 uppercase pl-1">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-surface-container-low border border-transparent rounded-2xl py-3.5 pl-4 pr-4 text-sm text-on-surface placeholder:text-on-surface/30 outline-none transition-all duration-200 focus:bg-white focus:border-primary/20 focus:shadow-[0_0_0_3px_rgba(91,60,221,0.15)]"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading || !token || !newPassword}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-2xl bg-brand-gradient text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-3"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "Confirm Reset"}
          </motion.button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-surface-container-highest">
          <Link to="/login" className="text-sm font-bold text-on-surface/60 hover:text-on-surface transition-colors">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
