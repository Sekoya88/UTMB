/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        utmb: {
          'dark-blue': '#003366',
          'blue': '#0066CC',
          'light-blue': '#4A90E2',
          'orange': '#FF6B35',
          'dark-orange': '#E85A2B',
          'green': '#4CAF50',
          'mountain': '#2C5F7C',
          'snow': '#F8FAFC',
        }
      },
      backgroundImage: {
        'mountain-gradient': 'linear-gradient(135deg, #003366 0%, #0066CC 50%, #4A90E2 100%)',
        'alpine-gradient': 'linear-gradient(to bottom, #003366, #2C5F7C)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

