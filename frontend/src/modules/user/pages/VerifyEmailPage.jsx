import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const email = params.get("email");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      setError("Please enter the verification code.");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await axios.post("http://localhost:8080/auth/verify-email", { email, code });
      setMessage("Email verified successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/auth/resend-verification", { email });
      setMessage("A new verification code has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12"
      style={{
        background: "linear-gradient(135deg, #5b3cdd 0%, #7459f7 60%, #6b4df5 100%)",
      }}
    >
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-[2rem] shadow-2xl p-8 sm:p-10 relative overflow-hidden"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Verify your email</h2>
            <p className="text-sm text-slate-500">
              We've sent a code to <span className="font-semibold text-slate-700">{email}</span>. Please enter it below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-1.5 text-center">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
                className="w-full bg-slate-50 text-center rounded-xl py-3 px-4 text-lg font-bold text-slate-800 tracking-[0.25em] placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-300 outline-none border border-slate-200 transition-all focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {error && <div className="text-red-500 text-xs text-center font-medium bg-red-50 p-2 rounded-lg">{error}</div>}
            {message && <div className="text-green-600 text-xs text-center font-medium bg-green-50 p-2 rounded-lg">{message}</div>}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#5b3cdd] text-white rounded-xl py-3.5 font-bold text-sm shadow-[0_8px_20px_rgba(91,60,221,0.25)] hover:bg-[#4a2tc8] transition-colors flex justify-center items-center"
            >
              {loading ? "Verifying..." : "Verify Account"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Didn't receive the code?{" "}
              <button
                onClick={handleResend}
                disabled={loading}
                className="font-bold text-indigo-600 hover:text-indigo-800 focus:outline-none"
              >
                Resend it
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
