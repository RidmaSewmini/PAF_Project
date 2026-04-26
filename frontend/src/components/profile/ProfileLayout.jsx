import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ActiveSessionsSection from "./ActiveSessionsSection";

export default function ProfileLayout({ userData, onUpdateProfile, onChangePassword, onUploadPhoto, onRemovePhoto, role, loading }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [localUserData, setLocalUserData] = useState({ name: userData?.name || "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);
  const [pwdStatus, setPwdStatus] = useState(null);

  React.useEffect(() => {
    if (userData) {
      setLocalUserData(prev => ({ ...prev, name: userData.name }));
    }
  }, [userData]);
  
  const handleInputChange = (e) => {
    setLocalUserData({ ...localUserData, [e.target.name]: e.target.value });
  };

  // Track if changes are unsaved
  const isNameChanged = localUserData.name !== userData?.name;

  const handleSaveProfile = async () => {
    if (!isNameChanged) return;
    setSaveStatus("saving");
    try {
      await onUpdateProfile({ name: localUserData.name });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus("error");
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;
    setPwdStatus({ type: "saving", message: "Updating..." });
    try {
      await onChangePassword({ 
        currentPassword: passwordData.currentPassword, 
        newPassword: passwordData.newPassword 
      });
      setPwdStatus({ type: "success", message: "Password updated safely." });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordErrors({});
      setTimeout(() => setPwdStatus(null), 4000);
    } catch (err) {
      setPwdStatus(null);
      setPasswordErrors({ currentPassword: "Current password is incorrect" });
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit");
      return;
    }

    setUploading(true);
    try {
      if (onUploadPhoto) await onUploadPhoto(file);
    } catch (err) {
      console.error(err);
      alert("Failed to upload photo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveClick = async () => {
    if (!window.confirm("Are you sure you want to remove your profile photo?")) return;
    setRemoving(true);
    try {
      if (onRemovePhoto) await onRemovePhoto();
    } catch (err) {
      console.error(err);
      alert("Failed to remove photo");
    } finally {
      setRemoving(false);
    }
  };

  if (loading || !userData) {
    return (
      <div className="flex-1 flex items-center justify-center p-10">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      {/* Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-aldrich text-5xl text-on-surface">Account Settings</h1>
          <p className="text-on-surface/60 font-medium mt-2">Manage your academic identity and security preferences.</p>
        </div>
      </div>

      {/* PROFILE HEADER GLASS CARD */}
      <div
        className="rounded-3xl p-8 border border-white/40 shadow-glass flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative group flex-shrink-0">
          <div className="w-32 h-32 rounded-full ring-4 ring-white shadow-lg overflow-hidden transition-transform duration-500 group-hover:scale-105 bg-surface-container-high flex items-center justify-center relative">
            {userData?.profileImageUrl ? (
                <img src={userData.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <span className="font-aldrich text-5xl text-primary">{userData?.name?.charAt(0)}</span>
            )}
            
            {(uploading || removing) && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
            )}
          </div>
          <div 
             className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
             onClick={() => !uploading && fileInputRef.current?.click()}
          >
            <span className="text-white text-3xl font-bold">+</span>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/jpg, image/webp" onChange={handleFileChange} />
        </div>

        <div className="flex-1 text-center md:text-left space-y-3 relative z-10">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h2 className="text-3xl font-titillium font-extrabold tracking-tight text-on-surface">{userData.name}</h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase">
              {role}
            </span>
          </div>
          <p className="text-on-surface/60 max-w-md">Institutional User • CampusFlow Operations</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
            <button disabled={uploading || removing} onClick={() => fileInputRef.current?.click()} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20 disabled:opacity-50">
              {uploading ? "Uploading..." : "Change Photo"}
            </button>
            {userData?.profileImageUrl && (
                <button disabled={uploading || removing} onClick={handleRemoveClick} className="text-on-surface hover:bg-surface-container-highest px-6 py-2.5 rounded-xl font-bold text-sm transition-all border border-outline-variant/30 disabled:opacity-50">
                  {removing ? "Removing..." : "Remove Photo"}
                </button>
            )}
          </div>
        </div>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* BASIC INFORMATION */}
        <div
          className="rounded-3xl p-8 border border-white/40 shadow-glass flex flex-col h-full relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <span className="text-primary p-2 bg-primary/10 rounded-lg font-bold">@</span>
            <h3 className="text-xl font-titillium font-bold text-on-surface">Basic Information</h3>
          </div>
          <div className="space-y-6 flex-1 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface/60 px-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={localUserData.name}
                onChange={handleInputChange}
                className="w-full bg-white/50 border border-transparent rounded-xl px-4 py-3.5 focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface/60 px-1">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  value={userData.email || ""}
                  disabled
                  readOnly
                  className="w-full bg-surface-container-high/40 text-on-surface/50 border border-transparent rounded-xl px-4 py-3.5 cursor-not-allowed font-medium outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/40 text-sm">🔒</span>
              </div>
              <p className="text-[10px] text-on-surface/50 italic px-1">Email cannot be changed. Contact IT support for alias modifications.</p>
            </div>
          </div>
          <div className="mt-8 flex gap-3 relative z-10">
            <button
              onClick={handleSaveProfile}
              disabled={saveStatus === "saving" || !isNameChanged}
              className="bg-brand-gradient text-white px-8 py-3 rounded-xl font-bold flex-1 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saveStatus === "saving" ? "Saving..." : saveStatus === "success" ? "Saved!" : "Save Changes"}
            </button>
            {isNameChanged && saveStatus !== "saving" && (
              <button
                onClick={() => setLocalUserData({ name: userData.name })}
                className="text-on-surface/60 font-bold px-6 py-3 hover:text-on-surface transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div
          className="rounded-3xl p-8 border border-white/40 shadow-glass flex flex-col h-full relative overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <span className="text-secondary p-2 bg-secondary/10 rounded-lg text-lg">🔑</span>
            <h3 className="text-xl font-titillium font-bold text-on-surface">Security Credentials</h3>
          </div>
          
          <AnimatePresence>
            {pwdStatus && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mb-4 px-4 py-2.5 rounded-xl text-xs font-bold ${pwdStatus.type === "success" ? "bg-emerald-50 text-emerald-600" : pwdStatus.type === "error" ? "bg-red-50 text-red-600" : "bg-surface-container-high text-on-surface/60"}`}>
                {pwdStatus.message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4 flex-1 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface/60 px-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••••••"
                className="w-full bg-white/50 border border-transparent rounded-xl px-4 py-3.5 focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface outline-none"
              />
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {passwordErrors.currentPassword}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface/60 px-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="w-full bg-white/50 border border-transparent rounded-xl px-4 py-3.5 focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface/60 px-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Repeat new password"
                className="w-full bg-white/50 border border-transparent rounded-xl px-4 py-3.5 focus:bg-white focus:border-primary/20 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-on-surface outline-none"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>
          <div className="mt-8 relative z-10">
            <button
              onClick={handleChangePassword}
              disabled={pwdStatus?.type === "saving" || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="w-full bg-surface-container-high text-primary border border-transparent px-8 py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE SESSIONS */}
      <ActiveSessionsSection />

      {/* DANGER ZONE */}
      <div className="md:col-span-2 bg-red-50/50 border border-red-200/50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative mt-8">
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-[160px]">
          ⚠️
          </div>
          <div className="space-y-1 relative z-10 text-center md:text-left text-red-900">
            <h3 className="text-xl font-titillium font-extrabold text-red-600">Danger Zone</h3>
            <p className="text-red-800/60 font-medium text-sm">Permanently delete your account and all associated academic data.</p>
          </div>
          <button className="bg-red-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95 relative z-10">
            Delete Account
          </button>
        </div>

      {/* h-10 spacing MUST be inside or wrapped */}
      <div className="h-10"></div>
    </div>
  );
}
