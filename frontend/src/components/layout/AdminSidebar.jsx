import { Link, useLocation } from "react-router-dom";
import React from "react";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Bell, Users, ClipboardList, User, Shield, Radio, Key, Settings, UserCircle } from "lucide-react";

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
    { label: "Tickets", path: "/dashboard", icon: <User /> },
    { label: "Bookings", path: "/admin/roles", icon: <Shield /> },
    { label: "Analytics", path: "/admin/broadcasts", icon: <Radio /> },
    { label: "Auth Logs", path: "/admin/auth-logs", icon: <Key /> },
    { label: "Settings", path: "/admin/settings", icon: <Settings /> },
    { label: "My Profile", path: "/admin/profile", icon: <UserCircle /> },
  ];

  return (
    <aside className="w-[280px] bg-gradient-to-b from-[#5b3cdd] to-[#7459f7] flex flex-col justify-between flex-shrink-0 relative z-20 h-full overflow-hidden shadow-[4px_0_24px_rgba(91,60,221,0.15)]">
      {/* Layer 1: Base Gradient is in the parent classes */}
      {/* Layer 2: Botanical / Texture Illustration Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+CjxwYXRoIGQ9Ik0wIDBoODB2ODBIMHoiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMiIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4=')]"></div>
      {/* Layer 3: Glass Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

      <div className="overflow-y-auto relative z-10 scrollbar-hide">
        {/* Sidebar Header */}
        <div className="px-10 mt-10 mb-12">
          <h1 className="font-editorial text-white text-[2rem] tracking-tight leading-tight italic">
            Admin Portal
          </h1>
          <p className="font-['Manrope'] text-[9px] font-bold tracking-[0.2em] text-white/70 uppercase mt-1">
            System Management
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="px-5 space-y-2 font-['Manrope']">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all font-semibold text-[14px] group ${isActive
                    ? "bg-white text-[#5b3cdd] shadow-[0_8px_20px_rgba(0,0,0,0.12)] translate-x-1"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-3 relative">
                  {React.cloneElement(item.icon, {
                    className: `w-5 h-5 transition-transform duration-300 ${isActive ? "text-[#5b3cdd]" : "text-white/80 group-hover:text-white"
                      }`,
                  })}
                  {item.label}
                </div>
                {item.badge > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-full shadow-sm ${isActive ? "bg-red-500 text-white" : "bg-white/20 text-white"
                    }`}>
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profile Card Bottom */}
      <div className="p-5 relative z-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-3 transition-colors hover:bg-white/15 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-white text-[#5b3cdd] flex items-center justify-center font-bold text-sm shadow-md overflow-hidden relative border-2 border-white/50">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "A"
            )}
          </div>
          <div className="font-['Manrope']">
            <p className="text-sm font-bold text-white">{user?.name || "Admin User"}</p>
            <p className="text-[10px] text-white/70 font-semibold tracking-wider uppercase">System Lead</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
