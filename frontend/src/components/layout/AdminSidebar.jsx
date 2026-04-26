import { Link, useLocation } from "react-router-dom";
import React from "react";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Bell, Users, ClipboardList, Ticket, Shield, Radio, Key, Settings, UserCircle } from "lucide-react";

export default function AdminSidebar() {
  const { unseenCount } = useNotifications();
  const { user } = useAuth();
  const profileImageUrl = user?.profileImageUrl;
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/admin-dashboard", icon: <LayoutDashboard /> },
    { label: "Notifications", path: "/admin/notifications", icon: <Bell />, badge: unseenCount },
    { label: "Users", path: "/admin/users", icon: <Users /> },
    { label: "Audit Logs", path: "/admin/audit", icon: <ClipboardList /> },
    { label: "Tickets", path: "/tickets", icon: <Ticket /> },
    { label: "User Roles", path: "/admin/roles", icon: <Shield /> },
    { label: "Broadcasts", path: "/admin/broadcasts", icon: <Radio /> },
    { label: "Auth Logs", path: "/admin/auth-logs", icon: <Key /> },
    { label: "Settings", path: "/admin/settings", icon: <Settings /> },
    { label: "My Profile", path: "/admin/profile", icon: <UserCircle /> },
  ];

  return (
    <aside className="w-[280px] bg-[#fcfdff] border-r border-[#f1f3f9] flex flex-col justify-between flex-shrink-0 relative z-20 h-full">
      <div className="overflow-y-auto">
        {/* Sidebar Header */}
        <div className="px-10 mt-10 mb-12">
          <h1 className="font-aldrich font-extrabold text-[#1f2937] text-[1.15rem] tracking-tight leading-tight">
            Admin Portal
          </h1>
          <p className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase mt-1">
            System Management
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="px-5 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-full transition-colors font-medium text-sm sidebar-item ${
                  isActive ? "active" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3 relative">
                  {isActive && <span className="w-1.5 h-6 bg-indigo-600 absolute -left-10 top-1/2 -translate-y-1/2 rounded-r-lg"></span>}
                  {React.cloneElement(item.icon, { className: "w-5 h-5 text-current" })}
                  {item.label}
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] bg-red-500 text-white font-black rounded-full">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile Card Bottom */}
      <div className="p-6">
        <div className="bg-indigo-50/50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-md overflow-hidden relative">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "A"
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{user?.name || "Admin User"}</p>
            <p className="text-[10px] text-slate-500 font-medium">System Lead</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
