/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          50: '#FFF5F0',
          100: '#FFE5D6',
          200: '#FFCCB3',
          300: '#FFB380',
          400: '#FF994D',
          500: '#FF6B35',
          600: '#E85A2C',
          700: '#C74A23',
          800: '#A53A1A',
          900: '#842A12',
        },
        secondary: {
          DEFAULT: '#F7931E',
          50: '#FEF5E6',
          100: '#FDEBC7',
          200: '#FBDA8E',
          300: '#F9C555',
          400: '#F7B01C',
          500: '#F7931E',
          600: '#D67D19',
          700: '#B56715',
          800: '#945110',
          900: '#733B0C',
        },
        accent: {
          DEFAULT: '#FF8C42',
          50: '#FFF5F0',
          100: '#FFE5D6',
          200: '#FFCCB3',
          300: '#FFB380',
          400: '#FF994D',
          500: '#FF8C42',
          600: '#E87A37',
          700: '#C7692C',
          800: '#A65821',
          900: '#854716',
        },
        background: '#FFFFFF',
        surface: '#F5F5F5',
        text: {
          DEFAULT: '#212121',
          secondary: '#757575',
        },
        border: '#E0E0E0',
        error: '#FF5252',
        success: '#4CAF50',
        warning: '#FF9800',
        info: '#2196F3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
