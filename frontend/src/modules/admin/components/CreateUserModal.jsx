import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateUserModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    verified: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/admin/users", formData, {
        headers: { "X-Admin-ID": localStorage.getItem("userId") }
      });
      toast.success("User created successfully!");
      onCreated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-3xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-md border border-surface-container-highest"
      >
        <h2 className="text-2xl font-aldrich font-bold text-on-surface mb-6">Create New User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-on-surface/70 mb-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-surface-container-highest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Enter name..." />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface/70 mb-1">Email Address</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-surface-container-highest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="mail@example.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface/70 mb-1">Password</label>
            <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-surface-container-highest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Enter secure password" />
          </div>
          <div className="flex gap-4">
             <div className="flex-1">
                <label className="block text-sm font-bold text-on-surface/70 mb-1">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-surface-container-highest outline-none focus:border-primary bg-transparent font-medium">
                   <option value="USER">User</option>
                   <option value="ADMIN">Admin</option>
                </select>
             </div>
             <div className="flex-1 flex flex-col justify-end pb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.verified} onChange={e => setFormData({...formData, verified: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-sm font-bold text-on-surface">Auto-Verify</span>
                </label>
             </div>
          </div>
          <div className="pt-4 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-on-surface/60 hover:bg-surface-container-low rounded-xl transition-colors">Cancel</button>
             <button type="submit" disabled={loading} className="flex-1 py-3 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors disabled:opacity-50">
               {loading ? "Creating..." : "Create Account"}
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
