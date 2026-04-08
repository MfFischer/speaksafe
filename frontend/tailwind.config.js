/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monochrome Dark theme colors
        'bg-primary': '#050505',
        'bg-secondary': '#121212',
        'bg-tertiary': '#1a1a1a',
        'bg-accent': '#262626',
        
        // Ash & Gray Accents
        'accent-bright': '#e2e8f0', // Light Ash
        'accent-mid': '#64748b',    // Slate / Gray
        'accent-dark': '#334155',   // Deep Ash
        
        // Text colors
        'text-primary': '#f8fafc',
        'text-secondary': '#94a3b8',
        'text-muted': '#475569',
        'text-accent': '#cbd5e1',
        
        // Status colors
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'info': '#3b82f6',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'display': ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        'glass-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.6)',
        'glow-bright': '0 0 20px rgba(226, 232, 240, 0.2)',
        'glow-mid': '0 0 20px rgba(100, 116, 139, 0.2)',
        'glass-inset': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      backdropBlur: {
        'glass': '12px',
        'glass-lg': '24px',
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 0% 0%, rgba(30, 30, 30, 0.4) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(20, 20, 20, 0.4) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(40, 40, 40, 0.4) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
        'pulse-glow': 'pulseGlow 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite reverse',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
