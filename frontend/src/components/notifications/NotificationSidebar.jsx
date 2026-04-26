import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";
import { Link } from "react-router-dom";

export default function NotificationSidebar({ isOpen, onClose }) {
  const { notifications, markAsRead, markAsUnread, markAllAsRead, markAllAsSeen } = useNotifications();

  // Mark all as seen automatically when sliding open
  useEffect(() => {
    if (isOpen) {
      markAllAsSeen();
    }
  }, [isOpen]);

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-[100dvh] w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col border-l border-surface-container-highest"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-surface-container-highest bg-surface/50">
              <h2 className="text-xl font-titillium font-bold text-on-surface">Notifications</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-lg"
                >
                  Mark all read
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-surface-container-high text-on-surface/60 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto w-full p-4 space-y-3 bg-surface-container-low/30">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-on-surface/40">
                  <span className="text-4xl mb-3">📭</span>
                  <p className="font-medium text-sm">No notifications yet.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-2xl border transition-all ${notif.isRead
                        ? "bg-white border-outline-variant/30 opacity-70"
                        : "bg-primary/5 border-primary/20 shadow-sm"
                      }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        {/* Icon mapped by Type */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm">
                            {notif.type === "PROFILE_UPDATE" ? "👤" : notif.type === "PROFILE_PICTURE" ? "🖼️" : "🔔"}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
                            {notif.type.replace("_", " ")}
                          </span>
                        </div>
                        <p className={`text-sm ${notif.isRead ? "text-on-surface/80" : "font-bold text-on-surface"}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-on-surface/50 mt-2 font-medium">
                          {formatDate(notif.createdAt)}
                        </p>
                      </div>

                      {/* Read Toggle */}
                      <button
                        onClick={() => notif.isRead ? markAsUnread(notif.id) : markAsRead(notif.id)}
                        className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 transition-colors ${notif.isRead ? "bg-outline-variant hover:bg-outline" : "bg-primary hover:bg-primary/80 ring-4 ring-primary/10"
                          }`}
                        title={notif.isRead ? "Mark as unread" : "Mark as read"}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-surface-container-highest bg-white text-center">
              <Link
                to="/notifications"
                onClick={onClose}
                className="text-sm font-bold text-on-surface/60 hover:text-primary transition-colors"
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
