import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await axios.post("http://localhost:8080/users/reset-password/request", { email });
      setStatus({ type: "success", message: res.data.message });
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Something went wrong" });
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
            Forgot Password
          </h2>
          <p className="text-sm text-on-surface/60">
            Enter your email to receive a password reset token.
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[10px] font-bold tracking-[0.14em] text-on-surface/40 uppercase pl-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-surface-container-low border border-transparent rounded-2xl py-3.5 pl-4 pr-4 text-sm text-on-surface placeholder:text-on-surface/30 outline-none transition-all duration-200 focus:bg-white focus:border-primary/20 focus:shadow-[0_0_0_3px_rgba(91,60,221,0.15)]"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading || !email}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-2xl bg-brand-gradient text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "Send Reset Token"}
          </motion.button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-surface-container-highest">
          <Link to="/reset-password" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors mr-6">
            I have a token
          </Link>
          <Link to="/login" className="text-sm font-bold text-on-surface/60 hover:text-on-surface transition-colors">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
