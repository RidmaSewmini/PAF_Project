import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../hooks/useAuth";

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative text-sm font-medium transition-colors duration-200 group ${
        isActive ? "text-primary" : "text-on-surface/70 hover:text-primary"
      }`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-primary transition-all duration-300 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </Link>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/#features", label: "Features" },
    { to: "/#resources", label: "Resources" },
    { to: "/#how-it-works", label: "How It Works" },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-panel shadow-glass py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3L1 9l11 6 11-6-11-6zM1 17l11 6 11-6M1 13l11 6 11-6"
                />
              </svg>
            </div>
            <span className="font-headline font-bold text-lg text-on-surface tracking-tight">
              Campus<span className="text-primary">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/userProfile"
                  className="text-sm font-medium text-primary hover:text-primary-container transition-colors"
                >
                  My Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium px-4 py-2 rounded-xl border border-primary/20 text-primary hover:bg-primary/5 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-on-surface/70 hover:text-primary transition-colors duration-200 px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-brand-gradient text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-surface-container-low transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-on-surface rounded-full transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-on-surface rounded-full transition-all duration-300 ${
                  menuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-on-surface rounded-full transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-2.5" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-3 space-y-1 border-t border-surface-container-highest mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-on-surface/70 hover:text-primary hover:bg-surface-container-low rounded-xl transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 flex flex-col gap-2 px-4">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-center text-sm font-medium py-2.5 rounded-xl border border-surface-container-highest hover:border-primary/30 text-on-surface/70 hover:text-primary transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-center text-sm font-semibold py-2.5 rounded-xl bg-brand-gradient text-white shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;
