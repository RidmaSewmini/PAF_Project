import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function EditUserModal({ user, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "",
    role: user.role || "USER",
    verified: user.verified || false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        verified: formData.verified
      };
      if (formData.password) payload.password = formData.password;

      await axios.put(`http://localhost:8080/users/${user.id}`, payload, {
        headers: { "X-Admin-ID": localStorage.getItem("userId") }
      });
      toast.success("User updated successfully!");
      onUpdated();
    } catch (err) {
      toast.error("Failed to update user");
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
        <h2 className="text-2xl font-aldrich font-bold text-on-surface mb-6">Edit User Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-on-surface/70 mb-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-surface-container-highest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface/70 mb-1 flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">Immutable</span>
            </label>
            <input disabled type="email" value={formData.email} className="w-full px-4 py-3 rounded-xl border border-surface-container-highest bg-slate-50 text-slate-500 cursor-not-allowed outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface/70 mb-1 flex justify-between">
               <span>New Password</span>
               <span className="text-[10px] text-on-surface/40 font-normal">Leave blank to keep unchanged</span>
            </label>
            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-surface-container-highest focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Enter new password to overwrite" />
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
                  <span className="text-sm font-bold text-on-surface">Verified</span>
                </label>
             </div>
          </div>
          <div className="pt-4 flex gap-3">
             <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-on-surface/60 hover:bg-surface-container-low rounded-xl transition-colors">Cancel</button>
             <button type="submit" disabled={loading} className="flex-1 py-3 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors disabled:opacity-50">
               {loading ? "Saving..." : "Save Changes"}
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
