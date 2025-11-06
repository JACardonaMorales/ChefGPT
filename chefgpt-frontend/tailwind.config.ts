import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF4D4F',
          50: '#FFF5F5',
          100: '#FFE5E6',
          200: '#FFCCCE',
          300: '#FF9999',
          400: '#FF6666',
          500: '#FF4D4F',
          600: '#FF3333',
          700: '#E60000',
          800: '#CC0000',
          900: '#990000',
        },
        secondary: {
          DEFAULT: '#FFD166',
          50: '#FFFBF0',
          100: '#FFF5D9',
          200: '#FFEBB3',
          300: '#FFE18D',
          400: '#FFD166',
          500: '#FFC947',
          600: '#FFBF00',
          700: '#CC9900',
          800: '#997300',
          900: '#664D00',
        },
        accent: {
          green: '#A8E6CF',
          orange: '#FFA552',
        },
        background: {
          light: '#FFF9F5',
          dark: '#1C1C1E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

