import React, { useState } from "react";
import DashboardWithSidebar from "../../../components/layout/DashboardWithSidebar";
import DashboardFooter from "../../../components/layout/DashboardFooter";
import { useNotifications } from "../../../context/NotificationContext";

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, enabled, toggleNotifications } = useNotifications();
  const [filter, setFilter] = useState("ALL"); // ALL, READ, UNREAD

  const filteredNotifs = notifications.filter(n => {
    if (filter === "READ") return n.isRead;
    if (filter === "UNREAD") return !n.isRead;
    return true;
  });

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString() + " at " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  return (
    <DashboardWithSidebar>
      <div className="absolute inset-0 bg-[#f8f9fc] pointer-events-none" />
      <div className="relative z-10 w-full max-w-4xl mx-auto mb-10 mt-6 min-h-[60vh] flex flex-col">

        {/* Header & Controls */}
        <div className="bg-white rounded-[2rem] p-8 shadow-glass mb-6 border border-surface-container-highest flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="font-aldrich text-4xl text-on-surface">Notifications Center</h1>
            <p className="text-on-surface/60 font-medium mt-1">Manage all your academic and booking alerts securely.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-surface-container-high/50 p-1.5 rounded-full border border-surface-container-highest">
              <button onClick={() => setFilter("ALL")} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${filter === "ALL" ? "bg-white shadow-sm text-on-surface" : "text-on-surface/50 hover:text-on-surface"}`}>All</button>
              <button onClick={() => setFilter("UNREAD")} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${filter === "UNREAD" ? "bg-white shadow-sm text-on-surface" : "text-on-surface/50 hover:text-on-surface"}`}>Unread</button>
            </div>
            <button onClick={toggleNotifications} className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? "bg-primary" : "bg-outline-variant"}`}>
              <span className={`block w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${enabled ? "translate-x-6.5 shadow-sm" : "translate-x-0.5"}`} style={{ left: enabled ? 'auto' : '2px', right: enabled ? '2px' : 'auto' }} />
            </button>
          </div>
        </div>

        {/* List View */}
        <div className="flex-1 bg-white rounded-[2rem] p-6 sm:p-8 shadow-glass border border-surface-container-highest">
          <div className="flex justify-between border-b border-surface-container-highest pb-4 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface/40">Recent Activity</h3>
            <button onClick={markAllAsRead} className="text-xs font-bold text-primary hover:text-primary/70">Mark History As Read</button>
          </div>

          <div className="space-y-4 pt-2">
            {filteredNotifs.length === 0 ? (
              <div className="py-20 text-center">
                <span className="text-5xl opacity-40 mb-4 block">📮</span>
                <h4 className="text-lg font-bold text-on-surface/70">You're all caught up!</h4>
                <p className="text-sm text-on-surface/40 mt-1">No {filter !== "ALL" ? filter.toLowerCase() : ""} notifications found.</p>
              </div>
            ) : (
              filteredNotifs.map((notif) => (
                <div key={notif.id} className={`flex items-start gap-4 p-5 rounded-2xl transition-all border ${notif.isRead ? "bg-surface-container-low/30 border-transparent opacity-80" : "bg-primary/5 border-primary/20 shadow-sm"}`}>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-surface-container-highest text-lg">
                    {notif.type === "PROFILE_UPDATE" ? "👤" : notif.type === "PROFILE_PICTURE" ? "🖼️" : "🔔"}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary bg-primary/10 px-2 py-0.5 rounded flex w-fit">{notif.type.replace("_", " ")}</span>
                      <span className="text-xs font-semibold text-on-surface/40">{formatDate(notif.createdAt)}</span>
                    </div>
                    <p className={`text-sm md:text-base ${notif.isRead ? "text-on-surface/70" : "font-bold text-on-surface"}`}>{notif.message}</p>
                  </div>
                  {!notif.isRead && (
                    <button onClick={() => markAsRead(notif.id)} className="text-[10px] font-bold text-primary hover:text-primary/70 mt-1 uppercase tracking-wider">
                      Mark Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
      <DashboardFooter />
    </DashboardWithSidebar>
  );
}
