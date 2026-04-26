import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Ticket, Bell, User } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

export default function UserSidebar() {
  const location = useLocation();
  const { unseenCount } = useNotifications();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard /> },
    { label: "Bookings", path: "/student/facilities", icon: <Calendar /> },
    { label: "Tickets", path: "/tickets", icon: <Ticket /> },
    { label: "Notifications", path: "/notifications", icon: <Bell />, badge: unseenCount > 0 ? unseenCount : 0 },
    { label: "My Profile", path: "/profile", icon: <User /> },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-surface-container-highest shadow-glass hidden lg:flex flex-col">
      <div className="px-4 py-4 border-b border-surface-container-highest">
        <h2 className="text-lg font-aldrich text-on-surface">User Dashboard</h2>
        <p className="text-xs text-gray-500 font-titillium">User Management</p>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface/40 mb-4 px-2">Main Menu</div>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between w-full p-3 rounded-2xl font-bold transition-all ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-on-surface/60 hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <div className="flex items-center gap-3">
                {React.cloneElement(item.icon, { className: "w-5 h-5 text-current" })}
                <span className="text-sm">{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${isActive ? 'bg-white text-primary' : 'bg-red-500 text-white'}`}>
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-surface-container-highest">
        <div className="bg-surface-container-low rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mt-10 -mr-10 pointer-events-none"></div>
          <p className="text-xs font-bold text-on-surface mb-1 relative z-10">Need Help?</p>
          <p className="text-[10px] font-medium text-on-surface/60 mb-3 relative z-10">Contact campus IT support.</p>
          <button className="w-full py-2 bg-on-surface text-white rounded-xl text-xs font-bold hover:bg-on-surface/90 transition-colors relative z-10">
            Open Support Ticket
          </button>
        </div>
      </div>
    </aside>
  );
}