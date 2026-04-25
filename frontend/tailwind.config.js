/** @type {import('tailwindcss').Config} */
const withOpacity = (cssVar) => ({ opacityValue } = {}) => {
  if (opacityValue === undefined) return `rgb(var(${cssVar}))`;
  return `rgb(var(${cssVar}) / ${opacityValue})`;
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette-driven semantic tokens (see src/index.css)
        primary: withOpacity("--cf-accent"),
        "primary-container": withOpacity("--cf-navy"),
        secondary: withOpacity("--cf-secondary"),
        tertiary: withOpacity("--cf-slate"),
        surface: withOpacity("--cf-surface"),
        "surface-container-low": withOpacity("--cf-surface-soft"),
        "surface-container-high": withOpacity("--cf-secondary-soft"),
        "surface-container-highest": withOpacity("--cf-border"),
        "surface-container-lowest": withOpacity("--cf-white"),
        "on-surface": withOpacity("--cf-ink"),
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        headline: ["Manrope", "sans-serif"],
        editorial: ['"Instrument Serif"', "serif"],
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, rgb(var(--cf-navy)) 0%, rgb(var(--cf-secondary)) 60%, rgb(var(--cf-accent)) 100%)",
        "hero-gradient":
          "linear-gradient(135deg, rgb(var(--cf-surface)) 0%, rgb(var(--cf-white) / 0.85) 55%, rgb(var(--cf-secondary) / 0.35) 100%)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 4px 24px 0 rgb(var(--cf-navy) / 0.10)",
        "card-hover": "0 12px 40px 0 rgb(var(--cf-navy) / 0.18)",
        glass: "0 8px 32px 0 rgb(var(--cf-navy) / 0.14)",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-delayed": "float 4s ease-in-out 1.5s infinite",
        "float-slow": "float 5s ease-in-out 0.8s infinite",
        "bounce-soft": "bounceSoft 2s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s ease both",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
