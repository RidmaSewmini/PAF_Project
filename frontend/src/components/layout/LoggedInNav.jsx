import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "../notifications/NotificationBell";
import NotificationSidebar from "../notifications/NotificationSidebar";
import { useAuth } from "../../context/AuthContext";
import { Search, LayoutDashboard, Settings, LogOut } from "lucide-react";

const LoggedInNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const profileImageUrl = user?.profileImageUrl;
  const firstName = user?.name ? user.name.split(" ")[0] : "US";

  const role = localStorage.getItem("role");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("rememberMe");
    navigate("/login");
  };

  const getDashboardPath = () => {
    return role === "ADMIN" ? "/admin-dashboard" : "/dashboard";
  };

  const getProfilePath = () => {
    return role === "ADMIN" ? "/admin/profile" : "/profile";
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3 border-b border-surface-container-highest"
          : "bg-white border-b border-surface-container-highest py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">

          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L1 9l11 6 11-6-11-6zM1 17l11 6 11-6M1 13l11 6 11-6" />
              </svg>
            </div>
            <span className="font-titillium font-bold text-lg text-on-surface tracking-tight hidden sm:block">
              Campus<span className="text-primary">Flow</span>
            </span>
          </Link>

          {/* Center: Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-on-surface/40" />
              </div>
              <input
                type="text"
                placeholder="Search for equipment, tickets..."
                className="w-full pl-11 pr-4 py-2.5 border border-surface-container-highest bg-surface-container-low/50 rounded-full text-[13px] font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-on-surface/40 text-on-surface"
              />
            </div>
          </div>

          {/* Right: Actions & Avatar */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <NotificationBell onClick={() => setSidebarOpen(true)} />

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full"
              >
                <div className="w-10 h-10 rounded-full bg-brand-gradient p-[2px] shadow-sm hover:shadow-md transition-all">
                  <div className="w-full h-full rounded-full bg-surface flex items-center justify-center border-[2px] border-white overflow-hidden relative">
                    {profileImageUrl ? (
                      <img src={profileImageUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[13px] font-extrabold text-primary tracking-wide">
                        {firstName.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-52 rounded-2xl bg-white shadow-xl shadow-black/5 ring-1 ring-surface-container-highest overflow-hidden z-50 pb-1"
                  >
                    <div className="bg-surface-container-low/50 px-4 py-3 border-b border-surface-container-highest mb-1">
                      <p className="text-[13px] font-extrabold text-on-surface">Account Options</p>
                      <p className="text-[10px] font-semibold text-on-surface/50 tracking-widest uppercase">{role || "USER"}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-[13px] font-semibold text-on-surface/70 hover:bg-surface-container-low hover:text-primary transition-colors gap-3"
                      >
                        <LayoutDashboard className="w-4 h-4 opacity-70" />
                        Dashboard
                      </Link>
                      <Link
                        to={getProfilePath()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-[13px] font-semibold text-on-surface/70 hover:bg-surface-container-low hover:text-primary transition-colors gap-3"
                      >
                        <Settings className="w-4 h-4 opacity-70" />
                        Edit Profile
                      </Link>
                      <div className="h-px bg-surface-container-highest my-1 mx-3"></div>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center px-4 py-2.5 text-[13px] tracking-wide font-bold text-red-500 hover:bg-red-50 transition-colors gap-3"
                      >
                        <LogOut className="w-4 h-4 opacity-70" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      <NotificationSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </motion.header>
  );
};

export default LoggedInNav;
