/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'], 
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-in forwards',
        'slide-out-right': 'slideOutRight 0.5s ease-in-out',
      },
      keyframes: {
        slideInRight: {
          '0%': {
            transform: 'translateX(100%)', 
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'login-page': "url('./src/assets/images/image 2.png')"
      },
      colors: {
        primary: '#6149CD',
        secondary: '#F96767',
        lightmode:'#F6EFFF'
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
      },
    },
    
  },
  darkMode: 'class',
  
  plugins: [],
};


