import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Floating badge card component
const FloatingCard = ({ icon, title, subtitle, delay, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
    className={`glass-panel rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[180px] ${className}`}
    style={{
      animation: `float ${4 + delay}s ease-in-out ${delay * 0.5}s infinite`,
    }}
  >
    <div className="w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center flex-shrink-0 shadow-sm">
      <span className="text-lg">{icon}</span>
    </div>
    <div>
      <p className="text-xs font-semibold text-on-surface leading-tight">{title}</p>
      <p className="text-[10px] text-on-surface/50 mt-0.5">{subtitle}</p>
    </div>
    <div className="ml-auto">
      <span className="w-2 h-2 rounded-full bg-emerald-400 block animate-pulse" />
    </div>
  </motion.div>
);

// Dashboard mockup cards
const DashboardCard = ({ label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/80 rounded-xl p-3 flex-1"
  >
    <div className={`w-2 h-2 rounded-full mb-2 ${color}`} />
    <p className="text-xs text-on-surface/50">{label}</p>
    <p className="text-base font-bold font-headline text-on-surface mt-0.5">{value}</p>
  </motion.div>
);

const Hero = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
  };

  return (
    <section className="relative min-h-screen bg-hero-gradient overflow-hidden pt-24 pb-16">
      {/* Background decorative blobs */}
      <div
        className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgb(var(--cf-secondary)) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgb(var(--cf-accent)) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          {/* Left: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                OPERATIONS REIMAGINED
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-headline text-5xl sm:text-6xl font-extrabold text-on-surface leading-[1.1] tracking-tight mb-6"
            >
              Smart Campus
              <br />
              <span className="editorial-text gradient-text">Operations</span>{" "}
              Made Simple
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-on-surface/60 leading-relaxed mb-8 max-w-lg"
            >
              Book campus resources, manage schedules, and report issues — all
              in one powerful platform designed for elite academic institutions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-gradient text-white font-semibold text-sm shadow-card hover:shadow-card-hover hover:scale-105 transition-all duration-300"
              >
                Get Started
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-surface-container-highest text-on-surface/70 font-medium text-sm hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-300"
              >
                Login
              </Link>
            </motion.div>

            {/* Stat pills */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-6 mt-10"
            >
              {[
                { value: "10K+", label: "Students" },
                { value: "500+", label: "Resources" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-headline text-2xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-xs text-on-surface/50 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Dashboard Visual */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Main dashboard card */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-md"
            >
              {/* Dashboard mockup */}
              <div className="glass-panel rounded-3xl p-6 shadow-glass">
                {/* Window dots */}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <div className="flex-1" />
                  <div className="h-2 w-20 bg-surface-container-highest rounded-full" />
                </div>

                {/* Charts mockup */}
                <div className="bg-surface-container-low rounded-2xl p-4 mb-4">
                  <div className="flex items-end gap-1.5 h-24">
                    {[40, 65, 50, 80, 60, 90, 72, 85, 55, 70].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 + i * 0.05 }}
                        style={{
                          height: `${h}%`,
                          originY: 1,
                          background:
                            i % 3 === 0
                              ? "linear-gradient(180deg, rgb(var(--cf-secondary)), rgb(var(--cf-navy)))"
                              : i % 3 === 1
                              ? "linear-gradient(180deg, rgb(var(--cf-accent)), rgb(var(--cf-secondary)))"
                              : "rgb(var(--cf-secondary) / 0.35)",
                        }}
                        className="flex-1 rounded-t-md min-w-0"
                      />
                    ))}
                  </div>
                </div>

                {/* Stat cards row */}
                <div className="flex gap-3">
                  <DashboardCard label="Bookings" value="1,248" color="bg-primary" delay={0.8} />
                  <DashboardCard label="Resources" value="64" color="bg-tertiary" delay={0.9} />
                  <DashboardCard label="Issues" value="12" color="bg-emerald-400" delay={1.0} />
                </div>

                {/* Map pin mockup */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="mt-4 bg-surface-container-low rounded-2xl h-16 flex items-center px-4 gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-surface-container-highest rounded w-3/4 mb-1.5" />
                    <div className="h-2 bg-surface-container-highest rounded w-1/2" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </motion.div>
              </div>

              {/* Floating badge cards */}
              <FloatingCard
                icon="🏠"
                title="Room Available"
                subtitle="Lab B • Now"
                delay={0.5}
                className="absolute -left-12 top-6 hidden sm:flex"
              />
              <FloatingCard
                icon="✅"
                title="Booking Approved"
                subtitle="Hall A • 2:00 PM"
                delay={0.8}
                className="absolute -right-8 bottom-20 hidden sm:flex"
              />
              <FloatingCard
                icon="🎫"
                title="Ticket Resolved"
                subtitle="AC Issue • Fixed"
                delay={1.1}
                className="absolute -left-8 bottom-4 hidden lg:flex"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-on-surface/40"
      >
        <p className="text-xs font-medium tracking-widest uppercase">Scroll</p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
