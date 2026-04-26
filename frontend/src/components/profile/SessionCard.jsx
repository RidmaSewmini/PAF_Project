import React from "react";
import { Monitor, Smartphone, CheckCircle, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function SessionCard({ session, onLogout }) {
  const isMobile = session.deviceInfo?.toLowerCase().includes("mobile") || session.deviceInfo?.toLowerCase().includes("ios") || session.deviceInfo?.toLowerCase().includes("android");
  
  // Format dates
  const loginDate = new Date(session.loginTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const loginTimeStr = new Date(session.loginTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  const lastActiveDate = new Date(session.lastActive).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const lastActiveTimeStr = new Date(session.lastActive).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
        session.isCurrent 
          ? "bg-primary/5 border-primary/20 shadow-[0_0_15px_rgba(91,60,221,0.05)]" 
          : "bg-white/50 border-white/40 hover:bg-white/80 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start md:items-center gap-4">
        {/* Device Icon */}
        <div className={`p-3 rounded-xl flex-shrink-0 ${session.isCurrent ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-surface-container-high text-on-surface/60"}`}>
          {isMobile ? <Smartphone className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
        </div>
        
        {/* Session Details */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-titillium font-bold text-on-surface text-base">
              {session.deviceInfo}
            </h4>
            {session.isCurrent && (
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Active (You)
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-on-surface/60 font-medium">
            <span>IP: {session.ipAddress}</span>
            <span className="hidden sm:inline">•</span>
            <span>Started: {loginDate} {loginTimeStr}</span>
          </div>
          <p className="text-[10px] text-on-surface/40 uppercase tracking-widest font-bold pt-1">
            Last Active: {lastActiveDate} {lastActiveTimeStr}
          </p>
        </div>
      </div>

      {/* Action Button */}
      {!session.isCurrent && (
        <button 
          onClick={() => onLogout(session.id)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high text-on-surface/70 hover:bg-red-50 hover:text-red-600 font-bold text-sm transition-colors border border-transparent hover:border-red-100"
        >
          <LogOut className="w-4 h-4" />
          Logout Device
        </button>
      )}
    </motion.div>
  );
}
