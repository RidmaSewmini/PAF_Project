/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5b3cdd",
        "primary-container": "#7459f7",
        surface: "#f9f9ff",
        "surface-container-low": "#f0f3ff",
        "surface-container-highest": "#d9e3f9",
        "surface-container-lowest": "#ffffff",
        tertiary: "#a12e70",
        secondary: "#674bb5",
        "on-surface": "#121c2c",
      },
      fontFamily: {
        sans: ["Titillium Web", "sans-serif"],
        editorial: ['"Instrument Serif"', "serif"],
        titillium: ['"Titillium Web"', "sans-serif"],
        aldrich: ["Aldrich", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #5b3cdd 0%, #7459f7 100%)",
        "hero-gradient":
          "linear-gradient(135deg, #f0f3ff 0%, #f9f9ff 60%, #e8e0fd 100%)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 4px 24px 0 rgba(91, 60, 221, 0.08)",
        "card-hover": "0 12px 40px 0 rgba(91, 60, 221, 0.18)",
        glass: "0 8px 32px 0 rgba(91, 60, 221, 0.12)",
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
